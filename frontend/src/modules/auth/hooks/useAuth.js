// El estado de sesión vive en shared/context (se comparte con toda la app,
// por ejemplo el Navbar y ProtectedRoute). Este hook lo re-expone dentro
// del módulo auth para que los screens de este módulo lo importen desde
// su propio módulo, como el resto de hooks.
export { useAuth } from '../../../shared/context/AuthContext.jsx';
