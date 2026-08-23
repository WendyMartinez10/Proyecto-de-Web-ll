import { useConfiguracion } from '../hooks/useConfiguracion.js';

const ETIQUETAS = {
    nombre_institucion: { label: 'Nombre de la institución', icon: 'bi-building', type: 'text' },
    rango_ip_permitido: { label: 'Rango de IP permitido para marcas (CIDR)', icon: 'bi-hdd-network', type: 'text', help: 'Ej: 0.0.0.0/0 permite cualquier red. Ej: 192.168.1.0/24 restringe a esa red.' },
    tiempo_max_sesion_min: { label: 'Tiempo máximo de sesión (minutos)', icon: 'bi-clock-history', type: 'number' },
    tamano_max_archivo_mb: { label: 'Tamaño máximo de archivo (MB)', icon: 'bi-file-earmark-arrow-up', type: 'number' }
};

export const Configuracion = () => {
    const { config, msg, error, loading, handleChange, handleSubmit } = useConfiguracion();

    if (loading) return <div className="container mt-5 text-center text-muted">Cargando configuración...</div>;

    const claves = Object.keys(ETIQUETAS).filter(k => k in config).concat(Object.keys(config).filter(k => !(k in ETIQUETAS)));

    return (
        <div className="container mt-4 mb-5 animate-fade-in-up">
            <h2 className="hero-gradient-text fw-bold mb-4"><i className="bi bi-gear me-2"></i>Configuración del Sistema</h2>

            <div className="glass-panel p-4" style={{ maxWidth: '700px' }}>
                {error && <div className="alert alert-danger p-2 text-center rounded-3 small">{error}</div>}
                {msg && <div className="alert alert-success p-2 text-center rounded-3 small">{msg}</div>}

                <form onSubmit={handleSubmit}>
                    {claves.map(clave => {
                        const meta = ETIQUETAS[clave] || { label: clave, icon: 'bi-sliders', type: 'text' };
                        return (
                            <div className="mb-4" key={clave}>
                                <label className="form-label text-muted small fw-semibold">
                                    <i className={`bi ${meta.icon} me-2 text-primary`}></i>{meta.label}
                                </label>
                                <input
                                    type={meta.type}
                                    className="form-control form-control-glass"
                                    value={config[clave] ?? ''}
                                    onChange={(e) => handleChange(clave, e.target.value)}
                                />
                                {meta.help && <div className="form-text">{meta.help}</div>}
                            </div>
                        );
                    })}

                    <button type="submit" className="btn btn-premium px-4"><i className="bi bi-check-lg me-2"></i>Guardar Configuración</button>
                </form>
            </div>
        </div>
    );
};
