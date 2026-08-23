import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext.jsx';

export const ProtectedRoute = ({ roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="container mt-5 text-center">Cargando...</div>;

    if (!user) return <Navigate to="/login" replace />;

    if (roles && !roles.includes(user.rol)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
