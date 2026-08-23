import { useMarcar } from '../hooks/useMarcar.js';

export const Marcar = () => {
    const { mensaje, error, nombreDisp, setNombreDisp, handleMarcar, handleRegistrarDispositivo } = useMarcar();

    return (
        <div className="container mt-5 animate-fade-in-up">
            <div className="text-center mb-5">
                <h1 className="hero-gradient-text fw-bold">Registro de Asistencia</h1>
                <p className="lead text-muted">El sistema detectará si es entrada o salida basándose en tu última marca.</p>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="glass-panel p-5">
                        <div className="row g-5">
                            {/* Columna Izquierda: Vincular Dispositivo */}
                            <div className="col-md-6 border-end position-relative">
                                <div className="d-flex flex-column h-100 justify-content-center pe-4">
                                    <div className="mb-4 text-primary">
                                        <i className="bi bi-laptop" style={{fontSize: '2.5rem'}}></i>
                                    </div>
                                    <h3 className="fw-bold mb-3">Paso 1: Registrar este dispositivo</h3>
                                    <p className="text-muted mb-4">Debes registrar tu PC o teléfono la primera vez que lo uses aquí por medidas de seguridad institucionales.</p>
                                    <form onSubmit={handleRegistrarDispositivo}>
                                        <div className="form-floating mb-4">
                                            <input
                                                type="text"
                                                className="form-control form-control-glass"
                                                id="nombreDisp"
                                                placeholder="Ej: Mi Laptop Personal"
                                                value={nombreDisp}
                                                onChange={(e) => setNombreDisp(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="nombreDisp">Nombre del dispositivo (Ej: Laptop HP)</label>
                                        </div>
                                        <button type="submit" className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold w-100">
                                            <i className="bi bi-link-45deg me-2"></i>Vincular Dispositivo
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Columna Derecha: Marcar */}
                            <div className="col-md-6">
                                <div className="d-flex flex-column h-100 justify-content-center align-items-center text-center ps-4">
                                    <h3 className="fw-bold mb-4">Paso 2: Acción</h3>
                                    <button className="btn btn-premium btn-premium-large w-100 d-flex flex-column align-items-center justify-content-center py-4" onClick={handleMarcar}>
                                        <i className="bi bi-fingerprint mb-2" style={{fontSize: '4rem'}}></i>
                                        <span className="fs-3">Marcar Asistencia</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center mt-5 animate-fade-in-up delay-200">
                <div className="col-md-8 text-center">
                    {mensaje && <div className="alert alert-success glass-panel py-3 fs-5 border-success text-success"><i className="bi bi-check-circle-fill me-2"></i>{mensaje}</div>}
                    {error && <div className="alert alert-danger glass-panel py-3 fs-5 border-danger text-danger"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}
                </div>
            </div>
        </div>
    );
};
