import { Link } from 'react-router-dom';
import { useRestablecerPassword } from '../hooks/useRestablecerPassword.js';

export const RestablecerPassword = () => {
    const { token, form, setForm, error, success, handleSubmit } = useRestablecerPassword();

    return (
        <div className="container mt-5 animate-fade-in-up">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="glass-panel p-5 mt-4">
                        <div className="text-center mb-4">
                            <i className="bi bi-shield-lock text-primary" style={{ fontSize: '3.5rem' }}></i>
                            <h2 className="fw-bold mt-2 hero-gradient-text">Restablecer Contraseña</h2>
                            <p className="text-muted">Ingresa tu nueva contraseña</p>
                        </div>

                        {!token && (
                            <div className="alert alert-warning p-3 text-center rounded-3">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                No se encontró un token en el enlace. Solicita uno nuevo desde "Olvidé mi contraseña".
                            </div>
                        )}
                        {error && <div className="alert alert-danger p-3 text-center rounded-3"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}
                        {success && <div className="alert alert-success p-3 text-center rounded-3"><i className="bi bi-check-circle-fill me-2"></i>Contraseña restablecida. Redirigiendo al login...</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-4">
                                <input
                                    className="form-control form-control-glass"
                                    id="nueva_password"
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    value={form.nueva_password}
                                    onChange={(e) => setForm({ ...form, nueva_password: e.target.value })}
                                    minLength={8}
                                    required
                                    disabled={success}
                                />
                                <label htmlFor="nueva_password">Nueva contraseña</label>
                            </div>
                            <div className="form-floating mb-4">
                                <input
                                    className="form-control form-control-glass"
                                    id="confirmar_password"
                                    type="password"
                                    placeholder="Confirmar contraseña"
                                    value={form.confirmar_password}
                                    onChange={(e) => setForm({ ...form, confirmar_password: e.target.value })}
                                    minLength={8}
                                    required
                                    disabled={success}
                                />
                                <label htmlFor="confirmar_password">Confirmar contraseña</label>
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-premium py-2 fs-5" type="submit" disabled={!token || success}>Restablecer</button>
                            </div>
                        </form>
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
