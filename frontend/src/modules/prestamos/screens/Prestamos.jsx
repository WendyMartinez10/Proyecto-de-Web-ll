import { usePrestamos } from '../hooks/usePrestamos.js';

export const Prestamos = () => {
    const {
        prestamos, equiposDisponibles, todosEquipos, form, setForm, filtros, detallesModal,
        handleFiltroChange, handleFiltrar, handleLimpiarFiltros, handleCheckbox,
        handleSubmit, handleDevolverCompleto, verDetalles, cerrarDetalles, handleDevolverDetalle
    } = usePrestamos();

    return (
        <div className="container mt-4 animate-fade-in-up mb-5">
            <h2 className="hero-gradient-text fw-bold mb-4">Gestión de Préstamos</h2>

            <div className="glass-panel p-4 mb-4">
                <h5 className="fw-bold mb-3"><i className="bi bi-cart-plus me-2 text-primary"></i>Nuevo Préstamo</h5>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label text-muted fw-semibold small">ID del Usuario (Estudiante/Funcionario)</label>
                        <input type="number" className="form-control form-control-glass" value={form.usuario_id} onChange={(e) => setForm({...form, usuario_id: e.target.value})} placeholder="Ej: 1" required />
                    </div>
                    <div className="col-md-8">
                        <label className="form-label text-muted fw-semibold small">Equipos Disponibles</label>
                        <div className="form-control-glass p-2 bg-light" style={{maxHeight: '150px', overflowY: 'auto'}}>
                            {equiposDisponibles.map(eq => (
                                <div className="form-check custom-checkbox mb-2" key={eq.id}>
                                    <input className="form-check-input" type="checkbox" value={eq.id} id={`eq-${eq.id}`} onChange={handleCheckbox} checked={form.equipos.includes(eq.id)} />
                                    <label className="form-check-label" htmlFor={`eq-${eq.id}`}>
                                        <span className="fw-bold">{eq.codigo}</span> - {eq.descripcion}
                                    </label>
                                </div>
                            ))}
                            {equiposDisponibles.length === 0 && <span className="text-muted fst-italic">No hay equipos disponibles en el inventario.</span>}
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <button type="submit" className="btn btn-premium px-4" disabled={form.equipos.length === 0 || !form.usuario_id}>
                            <i className="bi bi-send-check me-2"></i>Crear Préstamo
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass-panel p-4 mb-4">
                <h5 className="fw-bold mb-3"><i className="bi bi-funnel me-2 text-primary"></i>Filtrar Historial</h5>
                <form onSubmit={handleFiltrar} className="row g-3 align-items-end">
                    <div className="col-md-2">
                        <label className="form-label text-muted small fw-semibold">ID Usuario</label>
                        <input type="number" className="form-control form-control-glass" name="usuario" value={filtros.usuario} onChange={handleFiltroChange} placeholder="Ej: 3" />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label text-muted small fw-semibold">Fecha</label>
                        <input type="date" className="form-control form-control-glass" name="fecha" value={filtros.fecha} onChange={handleFiltroChange} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label text-muted small fw-semibold">Estado</label>
                        <select className="form-select form-control-glass" name="estado" value={filtros.estado} onChange={handleFiltroChange}>
                            <option value="">Todos</option>
                            <option value="activo">Activo</option>
                            <option value="finalizado">Finalizado</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label text-muted small fw-semibold">Equipo</label>
                        <select className="form-select form-control-glass" name="equipo" value={filtros.equipo} onChange={handleFiltroChange}>
                            <option value="">Todos</option>
                            {todosEquipos.map(eq => (
                                <option key={eq.id} value={eq.id}>{eq.codigo} - {eq.descripcion}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3 d-flex gap-2">
                        <button type="submit" className="btn btn-premium px-4"><i className="bi bi-search me-1"></i>Filtrar</button>
                        <button type="button" className="btn btn-outline-secondary px-3" onClick={handleLimpiarFiltros}>Limpiar</button>
                    </div>
                </form>
            </div>

            <div className="glass-panel overflow-hidden position-relative">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Número</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Usuario</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Encargado</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Fecha</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Estado</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prestamos.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-5 text-muted"><i className="bi bi-calendar2-x fs-1 d-block mb-2"></i>No hay préstamos registrados.</td></tr>
                        ) : prestamos.map(p => (
                            <tr key={p.id}>
                                <td className="px-4 fw-bold text-primary">{p.numero_prestamo}</td>
                                <td className="px-4">{p.usuario}</td>
                                <td className="px-4 text-muted small">{p.encargado}</td>
                                <td className="px-4 font-monospace small">{new Date(p.fecha).toLocaleString()}</td>
                                <td className="px-4">
                                    <span className={`badge rounded-pill bg-${p.estado === 'finalizado' ? 'success' : 'warning'} bg-opacity-25 text-${p.estado === 'finalizado' ? 'success' : 'warning'} px-3 py-1`}>
                                        {p.estado.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-4 text-end">
                                    <button className="btn btn-sm btn-light text-primary me-2 shadow-sm rounded-pill px-3" onClick={() => verDetalles(p.id)}><i className="bi bi-eye me-1"></i> Detalles</button>
                                    {p.estado !== 'finalizado' && (
                                        <button className="btn btn-sm btn-outline-success shadow-sm rounded-pill px-3" onClick={() => handleDevolverCompleto(p.id)}><i className="bi bi-check2-all me-1"></i> Devolver Todo</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {detallesModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center animate-fade-in-up" style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
                    <div className="glass-panel" style={{width: '600px', maxWidth: '90%'}}>
                        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                            <h5 className="fw-bold mb-0 text-primary"><i className="bi bi-list-check me-2"></i>Detalles del Préstamo #{detallesModal.id}</h5>
                            <button className="btn btn-light rounded-circle shadow-sm" style={{width:'36px', height:'36px'}} onClick={cerrarDetalles}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="p-4">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 text-muted">Equipo</th>
                                            <th className="border-0 text-muted">Estado</th>
                                            <th className="border-0 text-muted text-end">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detallesModal.detalles.map(d => (
                                            <tr key={d.id}>
                                                <td className="fw-medium">{d.codigo} - <span className="text-muted fw-normal">{d.descripcion}</span></td>
                                                <td><span className={`badge bg-${d.estado_devolucion === 'devuelto' ? 'success' : 'warning'} bg-opacity-25 text-${d.estado_devolucion === 'devuelto' ? 'success' : 'warning'} rounded-pill px-2 py-1`}>{d.estado_devolucion.toUpperCase()}</span></td>
                                                <td className="text-end">
                                                    {d.estado_devolucion !== 'devuelto' ? (
                                                        <button className="btn btn-sm btn-success rounded-pill px-3 shadow-sm" onClick={() => handleDevolverDetalle(detallesModal.id, d.id)}><i className="bi bi-arrow-return-left me-1"></i> Devolver</button>
                                                    ) : (
                                                        <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
