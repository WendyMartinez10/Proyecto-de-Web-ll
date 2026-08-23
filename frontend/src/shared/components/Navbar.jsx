import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-light navbar-glass mb-5 sticky-top">
            <div className="container-fluid px-4">
                <Link className="navbar-brand" to="/">
                    <i className="bi bi-layers-fill text-primary me-2"></i>UTN Marcas y Equipos
                </Link>
                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-medium">
                        <li className="nav-item me-2">
                            <Link className="nav-link text-dark" to="/"><i className="bi bi-house-door"></i> Inicio</Link>
                        </li>
                        <li className="nav-item me-2">
                            <Link className="nav-link text-dark" to="/marcar"><i className="bi bi-fingerprint text-primary"></i> Marcar Asistencia</Link>
                        </li>
                        <li className="nav-item me-2">
                            <Link className="nav-link text-dark" to="/dispositivos"><i className="bi bi-laptop text-secondary"></i> Dispositivos</Link>
                        </li>
                        {user.rol === 'administrador' && (
                            <>
                                <li className="nav-item me-2">
                                    <Link className="nav-link text-dark" to="/admin/reportes"><i className="bi bi-file-earmark-text text-secondary"></i> Reportes</Link>
                                </li>
                                <li className="nav-item me-2">
                                    <Link className="nav-link text-dark" to="/admin/equipos"><i className="bi bi-pc-display text-secondary"></i> Inventario</Link>
                                </li>
                                <li className="nav-item me-2">
                                    <Link className="nav-link text-dark" to="/admin/prestamos"><i className="bi bi-arrow-left-right text-secondary"></i> Préstamos</Link>
                                </li>
                                <li className="nav-item me-2">
                                    <Link className="nav-link text-dark" to="/admin/departamentos"><i className="bi bi-diagram-3 text-secondary"></i> Departamentos</Link>
                                </li>
                                <li className="nav-item me-2">
                                    <Link className="nav-link text-dark" to="/admin/configuracion"><i className="bi bi-gear text-secondary"></i> Configuración</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="d-flex align-items-center">
                        <Link to="/perfil" className="d-flex align-items-center me-4 text-decoration-none">
                            <div className="bg-light rounded-circle p-2 d-flex justify-content-center align-items-center shadow-sm" style={{width: '35px', height: '35px'}}>
                                <i className="bi bi-person text-primary"></i>
                            </div>
                            <span className="ms-2 fw-semibold text-dark">{user.nombre_completo}</span>
                        </Link>
                        <button className="btn btn-outline-danger rounded-pill px-4" onClick={handleLogout}><i className="bi bi-box-arrow-right"></i> Salir</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
