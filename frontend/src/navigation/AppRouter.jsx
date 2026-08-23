import { Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { Navbar } from '../shared/components/Navbar.jsx';
import { Home } from '../app/Home.jsx';

import { Login } from '../modules/auth/screens/Login.jsx';
import { Registro } from '../modules/auth/screens/Registro.jsx';
import { Perfil } from '../modules/auth/screens/Perfil.jsx';
import { OlvidePassword } from '../modules/auth/screens/OlvidePassword.jsx';
import { RestablecerPassword } from '../modules/auth/screens/RestablecerPassword.jsx';

import { Marcar } from '../modules/marcas/screens/Marcar.jsx';
import { Reportes } from '../modules/marcas/screens/Reportes.jsx';
import { Dispositivos } from '../modules/dispositivos/screens/Dispositivos.jsx';
import { Inventario } from '../modules/equipos/screens/Inventario.jsx';
import { Prestamos } from '../modules/prestamos/screens/Prestamos.jsx';
import { Departamentos } from '../modules/departamentos/screens/Departamentos.jsx';
import { Configuracion } from '../modules/configuracion/screens/Configuracion.jsx';

const Layout = () => (
    <>
        <Navbar />
        <div className="container">
            <Outlet />
        </div>
    </>
);

export const AppRouter = () => (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/olvide-password" element={<OlvidePassword />} />
        <Route path="/restablecer-password" element={<RestablecerPassword />} />

        <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/marcar" element={<Marcar />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/dispositivos" element={<Dispositivos />} />
            </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['administrador']} />}>
            <Route element={<Layout />}>
                <Route path="/admin/equipos" element={<Inventario />} />
                <Route path="/admin/prestamos" element={<Prestamos />} />
                <Route path="/admin/reportes" element={<Reportes />} />
                <Route path="/admin/departamentos" element={<Departamentos />} />
                <Route path="/admin/configuracion" element={<Configuracion />} />
            </Route>
        </Route>
    </Routes>
);
