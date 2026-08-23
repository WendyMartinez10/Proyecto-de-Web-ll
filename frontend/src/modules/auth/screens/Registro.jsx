import { Link } from 'react-router-dom';
import { useRegistro } from '../hooks/useRegistro.js';

export const Registro = () => {
    const { departamentos, error, success, handleChange, handleSubmit } = useRegistro();

    return (
        <div className="container mt-4 mb-5 animate-fade-in-up">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="glass-panel p-5 mt-3">
                        <div className="text-center mb-4">
                            <i className="bi bi-person-plus text-primary" style={{fontSize: '3rem'}}></i>
                            <h2 className="fw-bold mt-2 hero-gradient-text">Crear Cuenta</h2>
                            <p className="text-muted">Únete al sistema de UTN Marcas y Equipos</p>
                        </div>

                        {error && <div className="alert alert-danger p-3 text-center rounded-3"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}
                        {success && <div className="alert alert-success p-3 text-center rounded-3"><i className="bi bi-check-circle-fill me-2"></i>Registro exitoso. Redirigiendo...</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input className="form-control form-control-glass" name="nombre_usuario" type="text" placeholder="Usuario" onChange={handleChange} required />
                                        <label>Nombre de Usuario</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input className="form-control form-control-glass" name="nombre_completo" type="text" placeholder="Nombre" onChange={handleChange} required />
                                        <label>Nombre Completo</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input className="form-control form-control-glass" name="fecha_nacimiento" type="date" onChange={handleChange} required />
                                        <label>Fecha de Nacimiento</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input className="form-control form-control-glass" name="correo" type="email" placeholder="Correo" onChange={handleChange} required />
                                        <label>Correo Electrónico</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input className="form-control form-control-glass" name="password" type="password" placeholder="Contraseña" onChange={handleChange} required minLength={8} />
                                        <label>Contraseña</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input className="form-control form-control-glass" name="confirmar_password" type="password" placeholder="Confirmar contraseña" onChange={handleChange} required minLength={8} />
                                        <label>Confirmar contraseña</label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-text mb-3">Mínimo 8 caracteres, con al menos una mayúscula y un número.</div>

                            <div className="form-floating mb-4">
                                <select className="form-select form-control-glass" name="departamento_id" onChange={handleChange} required defaultValue="">
                                    <option value="" disabled>Seleccione un departamento...</option>
                                    {departamentos.map(d => (
                                        <option key={d.id} value={d.id}>{d.nombre}</option>
                                    ))}
                                </select>
                                <label>Departamento al que pertenece</label>
                            </div>

                            <div className="d-grid mt-2">
                                <button className="btn btn-premium py-3 fs-5" type="submit" disabled={success}>
                                    <i className="bi bi-person-plus-fill me-2"></i>Registrarse
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="text-center mt-4 animate-fade-in-up delay-200">
                        <p className="text-muted">¿Ya tienes cuenta? <Link to="/login" className="text-primary fw-bold text-decoration-none">Inicia sesión</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
