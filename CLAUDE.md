# CLAUDE.md — Memoria del proyecto ITAIC Frontend

## ¿Qué es este proyecto?

Frontend del LMS (Learning Management System) del **Instituto Teológico de las Asambleas de Iglesias Cristianas (ITAIC)**.
Es un sitio estático desplegado en **GitHub Pages**, rama `deploy`.

## Stack tecnológico

- **HTML + Vanilla JS** (ES6 modules, sin bundler)
- **Bootstrap 5.3.8** (vía CDN)
- **Sin npm, sin build step** — los cambios se despliegan directamente

## API backend

- **Base URL:** `https://opnlms.onrender.com/api/v1`
- **Health:** `https://opnlms.onrender.com/health`
- El backend corre en Render (puede tener cold starts)

### Endpoints conocidos

| Método   | Ruta                                  | Uso                                    |
|----------|---------------------------------------|----------------------------------------|
| POST     | `/auth/register`                      | Registrar usuario (admin)              |
| POST     | `/auth/login`                         | Iniciar sesión                         |
| GET      | `/auth/me`                            | Obtener usuario autenticado            |
| GET      | `/courses`                            | Listar todos los cursos                |
| POST     | `/courses`                            | Crear curso (admin/docente)            |
| GET      | `/courses/{id}`                       | Detalle de un curso                    |
| PUT      | `/courses/{id}`                       | Actualizar curso (admin/docente)       |
| DELETE   | `/courses/{id}`                       | Eliminar curso (admin/docente)         |
| POST     | `/enrollments/{course_id}`            | Matricularse en un curso               |
| DELETE   | `/enrollments/{course_id}`            | Cancelar matrícula                     |
| GET      | `/enrollments/my-courses`             | Cursos en los que está inscrito        |
| GET      | `/enrollments/{course_id}/students`   | Estudiantes inscritos en un curso      |

## Estructura de archivos

```
/
├── index.html            # Dashboard: estudiante (mis cursos + explorar), admin/docente (overview)
├── login.html            # Formulario de inicio de sesión
├── profile.html          # Perfil del usuario autenticado
├── register.html         # Registro de usuarios (solo admin)
├── manage-courses.html   # Gestión de cursos (admin/docente): crear, editar, eliminar, ver inscritos
├── health.html           # Diagnóstico de conexión a la API
├── assets/
│   └── image.png     # Logo de la institución
├── js/
│   ├── config.js     # Constantes globales (URLs, nombre institución)
│   ├── auth.js       # Token management, authFetch, requireAuth, logout
│   ├── ui.js         # setTitle(), loadFooter()
│   ├── theme.js      # initTheme(), toggleTheme(), getTheme()
│   └── navbar.js     # loadNavbar({ activePage }) — inyecta navbar, carga usuario, devuelve user
├── CLAUDE.md         # Este archivo
└── .gitignore
```

## Convención de componentes compartidos

**No copiar HTML entre páginas.** Los componentes que se repiten (navbar, footer) viven en módulos JS:

- `loadNavbar({ activePage })` — inyecta el navbar en `#navbar-container`, inicializa el tema, configura logout y devuelve el objeto `user` de la API. Las páginas reutilizan ese `user` sin hacer una segunda llamada a `/auth/me`.
- `loadFooter()` — inyecta el footer en `#footer-container`.

Cada página HTML solo tiene `<div id="navbar-container"></div>` y llama a `loadNavbar()`.

## Estructura de respuesta de la API

Se asume este formato estándar:
```json
{
  "success": true,
  "data": { ... }
}
```

### Objeto usuario (`/auth/me`)

```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "role": "admin",     // o "student", "teacher"
  "is_admin": true     // campo alternativo que también se verifica
}
```

## Lógica de autenticación

- El token se guarda en `localStorage` bajo la clave `token`
- `requireAuth()` en `auth.js` redirige a `login.html` si no hay token
- `authFetch()` inyecta el header `Authorization: Bearer <token>` y hace logout automático en 401
- El objeto `user` también se guarda en `localStorage` (clave `user`) al hacer login

## Verificación de rol admin

La verificación de admin es **doble**:
1. **Frontend (UX):** Se consulta `/auth/me` y se oculta/muestra el enlace a `register.html` según `user.role === 'admin'` o `user.is_admin === true`
2. **Backend (seguridad real):** El endpoint `POST /users` debe rechazar con 403 si el token no pertenece a un admin. **El frontend nunca es suficiente por sí solo.**

## Despliegue

- Rama de producción: `deploy`
- Rama de desarrollo: `main`
- Plataforma: GitHub Pages
- Para publicar: hacer push a `deploy`

## Convenciones del proyecto

- Todo el texto de UI está en **español**
- Los scripts son `type="module"` para poder usar imports de ES6
- El tema (dark/light) se persiste en `localStorage` bajo la clave `theme`
- No usar frameworks ni instalar dependencias — mantener el proyecto ligero
- XSS prevention: usar `escapeHTML()` al renderizar datos de la API en innerHTML
