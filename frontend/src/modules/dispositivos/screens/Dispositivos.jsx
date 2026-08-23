import { useDispositivos } from '../hooks/useDispositivos.js';

export const Dispositivos = () => {
    const { dispositivos, form, setForm, msg, error, handleSubmit, handleToggleEstado } = useDispositivos();

    return (
        <div className="container mt-4 mb-5 animate-fade-in-up">
            <h2 className="hero-gradient-text fw-bold mb-4"><i className="bi bi-laptop me-2"></i>Mis Dispositivos</h2>
            <p className="text-muted mb-4">Solo podrás registrar marcas de asistencia desde dispositivos activos y previamente registrados.</p>

            <div className="glass-panel p-4 mb-4">
                <h5 className="fw-bold mb-3"><i className="bi bi-plus-circle me-2 text-primary"></i>Registrar este dispositivo</h5>

                {error && <div className="alert alert-danger p-2 text-center rounded-3 small">{error}</div>}
                {msg && <div className="alert alert-success p-2 text-center rounded-3 small">{msg}</div>}

                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-5">
                        <input type="text" className="form-control form-control-glass" placeholder="Nombre (Ej: Laptop personal)" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                    </div>
                    <div className="col-md-5">
                        <input type="text" className="form-control form-control-glass" placeholder="Descripción (opcional)" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                    </div>
                    <div className="col-md-2 d-grid">
                        <button type="submit" className="btn btn-premium">Registrar</button>
                    </div>
                </form>
            </div>

            <div className="glass-panel overflow-hidden">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Nombre</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Descripción</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Registrado</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Estado</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dispositivos.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-4 text-muted">No tienes dispositivos registrados.</td></tr>
                        ) : dispositivos.map(d => (
                            <tr key={d.id}>
                                <td className="px-4 fw-bold">{d.nombre}</td>
                                <td className="px-4 text-muted">{d.descripcion || '—'}</td>
                                <td className="px-4 font-monospace small">{new Date(d.fecha_registro).toLocaleDateString()}</td>
                                <td className="px-4">
                                    <span className={`badge rounded-pill bg-${d.estado === 'activo' ? 'success' : 'secondary'} bg-opacity-25 text-${d.estado === 'activo' ? 'success' : 'secondary'} px-3 py-2`}>
                                        {d.estado.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-4 text-end">
                                    <button
                                        className={`btn btn-sm ${d.estado === 'activo' ? 'btn-outline-danger' : 'btn-outline-success'} rounded-pill px-3 shadow-sm`}
                                        onClick={() => handleToggleEstado(d)}
                                    >
                                        <i className={`bi ${d.estado === 'activo' ? 'bi-slash-circle' : 'bi-check-circle'} me-1`}></i>
                                        {d.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
