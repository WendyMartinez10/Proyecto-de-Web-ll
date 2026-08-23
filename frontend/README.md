# Frontend - Sistema de Marcas y Préstamo de Equipos

React + Vite + Bootstrap. Consume la API del backend mediante `fetch()`,
con cookies de sesión (`credentials: 'include'`).

## Instalación

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`. Asegúrate de que el backend esté
corriendo en `http://localhost:4000` (o ajusta `VITE_API_URL` en `.env`).

## Estructura del proyecto

```
frontend/src/
├── api/
│   └── client.js              # fetch() genérico: base URL, credentials, manejo de errores
├── app/
│   ├── App.jsx                 # Shell de la app: AuthProvider + BrowserRouter
│   └── Home.jsx                 # Pantalla de inicio
├── assets/                      # Imágenes/assets estáticos propios (vacío: se usa Bootstrap Icons)
├── modules/                     # Un módulo por dominio del backend
│   ├── auth/                    #   login, registro, perfil, recuperar/restablecer contraseña
│   ├── departamentos/
│   ├── dispositivos/
│   ├── equipos/
│   ├── marcas/                  #   marcar asistencia + reportes/exportación
│   ├── prestamos/
│   └── configuracion/
│       ├── hooks/                #   lógica y estado (useX.js) — lo único con estado real
│       ├── screens/               #   componentes de página, solo presentación
│       ├── services/               #   llamadas fetch a los endpoints de ese módulo
│       └── styles/                  #   CSS propio del módulo (reservado, vacío por ahora)
├── navigation/
│   ├── AppRouter.jsx             # Todas las <Route> de la aplicación
│   └── ProtectedRoute.jsx        # Redirige según sesión y rol
├── shared/
│   ├── components/
│   │   └── Navbar.jsx            # Barra de navegación (usa el contexto de sesión)
│   └── context/
│       └── AuthContext.jsx        # Estado global de sesión (useAuth)
├── theme/
│   └── index.css                 # Sistema de diseño (paleta, tipografía, glass-panel, btn-premium…)
└── main.jsx
```

### Patrón de cada módulo

```
routes (navigation/AppRouter.jsx)
  → screens/*.jsx        (solo JSX, usa un hook, no llama a fetch directamente)
  → hooks/useX.js        (useState/useEffect, arma los handlers, llama a services/)
  → services/x.service.js (una función por endpoint, usa api/client.js)
```

Esto significa que cualquier pantalla se puede leer sin buscar la lógica
de datos mezclada en el JSX, y cualquier lógica de datos se puede probar o
reutilizar sin depender de un componente concreto.

## Reestructuración realizada

El proyecto original tenía todo el código en `src/pages` (una página por
pantalla, con toda la lógica de estado y las llamadas a la API mezcladas
en el mismo archivo) y `src/api` (un archivo por módulo, con las llamadas
a los endpoints). Se reorganizó en el patrón `modules/<módulo>/{hooks,
screens, services, styles}` junto con `api/`, `app/`, `navigation/`,
`shared/` y `theme/` a nivel superior. Cada pantalla se dividió en:

- Un **hook** (`hooks/useX.js`) con toda la lógica que antes vivía dentro
  del componente de página (estado, efectos, handlers), extraída tal cual
  sin cambiar su comportamiento.
- Una **screen** (`screens/X.jsx`) que solo renderiza JSX y usa el hook.
- El **service** (`services/x.service.js`), que es el antiguo archivo de
  `api/`, solo movido dentro del módulo correspondiente.

`AuthContext` y `Navbar` se movieron a `shared/` por ser utilizados desde
varios módulos a la vez. `ProtectedRoute` y las rutas de React Router se
movieron a `navigation/`. El `index.css` con el sistema de diseño se
movió a `theme/`. `App.jsx` se redujo a un shell mínimo (Provider +
Router) dentro de `app/`.

**Se verificó que el comportamiento no cambió**: se instaló el proyecto,
se corrió `npm run build` (compila sin errores) y `npm run lint` (mismos
9 warnings que ya existían antes de la reestructuración, ninguno nuevo),
y se confirmó que el bundle final sigue apuntando a los mismos 8
endpoints de autenticación y a los 6 módulos de negocio del backend.
