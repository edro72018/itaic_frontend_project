import { authFetch, logout } from './auth.js';
import { API_BASE_URL } from './config.js';
import { initTheme, toggleTheme, getTheme } from './theme.js';

/**
 * Inyecta el navbar en #navbar-container, inicializa el tema,
 * carga el usuario autenticado y devuelve el objeto user.
 *
 * @param {Object} options
 * @param {string} options.activePage - 'inicio' | 'pensum' | 'perfil' | 'registro' | 'cursos'
 * @returns {Promise<Object|null>} Objeto user de la API, o null si falla
 */
export async function loadNavbar({ activePage = '' } = {}) {
  const container = document.getElementById('navbar-container');
  if (!container) return null;

  initTheme();

  const isActive = (page) => activePage === page ? 'active' : '';

  container.innerHTML = `
    <nav class="navbar navbar-expand-lg bg-body-tertiary rounded">
      <div class="container-fluid">

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse d-lg-flex" id="navbarMain">

          <a class="navbar-brand col-lg-3 me-0" href="index.html">
            <img src="assets/image.png" alt="Logo" width="50" height="50" class="d-inline-block align-text-top">
          </a>

          <ul class="navbar-nav col-lg-6 justify-content-lg-center">
            <li class="nav-item">
              <a class="nav-link ${isActive('inicio')}" href="index.html">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link ${isActive('pensum')}" href="#">Pénsum</a>
            </li>
          </ul>

          <div class="d-lg-flex col-lg-3 justify-content-lg-end align-items-center gap-2">

            <button class="btn btn-outline-secondary" id="theme-toggle" title="Cambiar tema">
              <span id="theme-icon"></span>
            </button>

            <div class="dropdown">
              <button
                class="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                👤 <span id="nav-username"></span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item ${isActive('perfil')}" href="profile.html">Perfil</a>
                </li>
                <li>
                  <a class="dropdown-item ${isActive('calificaciones')}" href="#">Calificaciones</a>
                </li>

                <!-- Admin y Docente -->
                <li id="staff-divider" class="d-none"><hr class="dropdown-divider"></li>
                <li id="manage-courses-item" class="d-none">
                  <a class="dropdown-item ${isActive('cursos')}" href="manage-courses.html">
                    📚 Gestionar cursos
                  </a>
                </li>

                <!-- Solo Admin -->
                <li id="admin-register-item" class="d-none">
                  <a class="dropdown-item text-warning ${isActive('registro')}" href="register.html">
                    ⚙️ Registrar usuario
                  </a>
                </li>

                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item text-danger" id="logout-btn">
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </nav>
  `;

  function updateThemeIcon() {
    document.getElementById('theme-icon').textContent = getTheme() === 'dark' ? '☀️' : '🌙';
  }

  updateThemeIcon();

  document.getElementById('theme-toggle').addEventListener('click', () => {
    toggleTheme();
    updateThemeIcon();
  });

  document.getElementById('logout-btn').addEventListener('click', logout);

  try {
    const response = await authFetch(`${API_BASE_URL}/auth/me`);
    const result = await response.json();

    if (response.ok && result.success) {
      const user = result.data;
      const displayName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
      document.getElementById('nav-username').textContent = displayName;

      const isAdmin   = user.role === 'admin'   || user.is_admin === true;
      const isTeacher = user.role === 'teacher';

      if (isAdmin || isTeacher) {
        document.getElementById('staff-divider').classList.remove('d-none');
        document.getElementById('manage-courses-item').classList.remove('d-none');
      }

      if (isAdmin) {
        document.getElementById('admin-register-item').classList.remove('d-none');
      }

      return user;
    }
  } catch (error) {
    console.error('Error al cargar el navbar:', error);
  }

  return null;
}
