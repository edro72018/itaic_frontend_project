// Guardar token
export function setToken(token) {
  localStorage.setItem('token', token);
}

// Obtener token
export function getToken() {
  return localStorage.getItem('token');
}

// Verificar si está autenticado
export function isAuthenticated() {
  return !!getToken();
}

// Proteger página
export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

// Logout
export function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Fetch con autenticación
export async function authFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Si el token ya no es válido
  if (response.status === 401) {
    logout();
  }

  return response;
}