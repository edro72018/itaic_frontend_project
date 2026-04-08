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

| Método | Ruta              | Uso                              |
|--------|-------------------|----------------------------------|
| POST   | `/auth/login`     | Iniciar sesión                   |
| GET    | `/auth/me`        | Obtener usuario autenticado      |
| GET    | `/courses`        | Listar cursos del usuario        |
| POST   | `/users`          | Crear usuario (requiere admin)   |

> **Nota:** El endpoint de registro (`POST /users`) puede diferir. Ajustar en `register.html` si la API usa otra ruta (ej. `/auth/register`).

## Estructura de archivos

```
/
├── index.html        # Dashboard principal (cursos, bienvenida)
├── login.html        # Formulario de inicio de sesión
├── register.html     # Registro de usuarios (solo admin)
├── health.html       # Diagnóstico de conexión a la API
├── assets/
│   └── image.png     # Logo de la institución
├── js/
│   ├── config.js     # Constantes globales (URLs, nombre institución)
│   ├── auth.js       # Token management, authFetch, requireAuth, logout
│   ├── ui.js         # setTitle(), loadFooter()
│   └── theme.js      # initTheme(), toggleTheme(), getTheme()
├── CLAUDE.md         # Este archivo
└── .gitignore
```

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
