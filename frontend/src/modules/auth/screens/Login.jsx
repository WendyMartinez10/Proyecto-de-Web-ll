import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin.js';

export const Login = () => {
    const { credenciales, error, handleChange, handleSubmit } = useLogin();

    return (
        <div className="container mt-5 animate-fade-in-up">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="glass-panel p-5 mt-4">
                        <div className="text-center mb-4">
                            <i className="bi bi-person-circle text-primary" style={{fontSize: '3.5rem'}}></i>
                            <h2 className="fw-bold mt-2 hero-gradient-text">Iniciar Sesión</h2>
                            <p className="text-muted">Ingresa tus credenciales para continuar</p>
                        </div>

                        {error && <div className="alert alert-danger p-3 text-center rounded-3"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-4">
                                <input
                                    className="form-control form-control-glass"
                                    id="identificador"
                                    name="identificador"
                                    type="text"
                                    placeholder="Usuario o Correo"
                                    value={credenciales.identificador}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="identificador">Usuario o Correo</label>
                            </div>
                            <div className="form-floating mb-4">
                                <input
                                    className="form-control form-control-glass"
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Contraseña"
                                    value={credenciales.password}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="password">Contraseña</label>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mt-3 mb-4">
                                <Link className="small text-decoration-none fw-semibold" to="/olvide-password">¿Olvidaste tu contraseña?</Link>
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-premium py-2 fs-5" type="submit">Ingresar</button>
                            </div>
                        </form>
                    </div>
                    <div className="text-center mt-4 animate-fade-in-up delay-200">
                        <p className="text-muted">¿No tienes cuenta? <Link to="/registro" className="text-primary fw-bold text-decoration-none">Regístrate aquí</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
