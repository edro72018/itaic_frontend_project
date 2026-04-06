
const THEME_KEY = 'theme';

// Obtener tema guardado o default
export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

// Aplicar tema
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

// Alternar tema
export function toggleTheme() {
  const current = getTheme();
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

// Inicializar al cargar página
export function initTheme() {
  applyTheme(getTheme());
}