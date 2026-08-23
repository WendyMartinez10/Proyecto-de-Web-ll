import { Link } from 'react-router-dom';
import { useOlvidePassword } from '../hooks/useOlvidePassword.js';

export const OlvidePassword = () => {
    const { identificador, setIdentificador, enviado, error, handleSubmit } = useOlvidePassword();

    return (
        <div className="container mt-5 animate-fade-in-up">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="glass-panel p-5 mt-4">
                        <div className="text-center mb-4">
                            <i className="bi bi-envelope-paper text-primary" style={{ fontSize: '3.5rem' }}></i>
                            <h2 className="fw-bold mt-2 hero-gradient-text">Recuperar Contraseña</h2>
                            <p className="text-muted">Te enviaremos un enlace para restablecerla</p>
                        </div>

                        {error && <div className="alert alert-danger p-3 text-center rounded-3"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}

                        {enviado ? (
                            <div className="alert alert-success p-3 text-center rounded-3">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                Si el usuario existe, se ha enviado un enlace de recuperación al correo asociado.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-4">
                                    <input
                                        className="form-control form-control-glass"
                                        id="identificador"
                                        type="text"
                                        placeholder="Usuario o Correo"
                                        value={identificador}
                                        onChange={(e) => setIdentificador(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="identificador">Usuario o Correo</label>
                                </div>
                                <div className="d-grid">
                                    <button className="btn btn-premium py-2 fs-5" type="submit">Enviar enlace</button>
                                </div>
                            </form>
                        )}
                    </div>
                    <div className="text-center mt-4 animate-fade-in-up delay-200">
                        <p className="text-muted">
                            <Link to="/login" className="text-primary fw-bold text-decoration-none">
                                <i className="bi bi-arrow-left me-1"></i>Volver a iniciar sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
