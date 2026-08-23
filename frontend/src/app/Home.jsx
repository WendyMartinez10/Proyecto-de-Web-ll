import { Link } from 'react-router-dom';

export const Home = () => (
    <div className="container mt-5 animate-fade-in-up">
        <div className="row justify-content-center">
            <div className="col-lg-8">
                <div className="glass-panel p-5 text-center">
                    <div className="mb-4 d-flex justify-content-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-4">
                            <i className="bi bi-shield-lock text-primary" style={{fontSize: '4rem'}}></i>
                        </div>
                    </div>
                    <h1 className="hero-gradient-text fw-bold mb-3" style={{fontSize: '3.5rem'}}>UTN Marcas</h1>
                    <p className="lead text-muted mb-5 fs-4">Sistema Integral de Control de Asistencia y Préstamo de Equipos Tecnológicos.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/marcar" className="btn btn-premium btn-premium-large">
                            <i className="bi bi-fingerprint me-2"></i>Ir a Marcar Asistencia
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
