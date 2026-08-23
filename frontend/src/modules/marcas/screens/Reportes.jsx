import { useReportes } from '../hooks/useReportes.js';

export const Reportes = () => {
    const { marcas, filtros, handleChange, handleBuscar, handleExportar } = useReportes();

    return (
        <div className="container mt-4 animate-fade-in-up">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="hero-gradient-text fw-bold m-0">Reportes de Asistencia</h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-danger shadow-sm rounded-pill px-3" onClick={() => handleExportar('pdf')}><i className="bi bi-file-pdf-fill me-1"></i> Exportar PDF</button>
                    <button className="btn btn-outline-success shadow-sm rounded-pill px-3" onClick={() => handleExportar('xml')}><i className="bi bi-filetype-xml me-1"></i> Exportar XML</button>
                    <button className="btn btn-outline-dark shadow-sm rounded-pill px-3" onClick={() => handleExportar('json')}><i className="bi bi-filetype-json me-1"></i> Exportar JSON</button>
                </div>
            </div>

            <div className="glass-panel p-4 mb-4">
                <h5 className="fw-bold mb-3"><i className="bi bi-funnel text-primary me-2"></i>Filtros de Búsqueda</h5>
                <form onSubmit={handleBuscar} className="row g-3">
                    <div className="col-md-2">
                        <input type="number" className="form-control form-control-glass" name="anio" placeholder="Año (Ej: 2026)" value={filtros.anio} onChange={handleChange} />
                    </div>
                    <div className="col-md-2">
                        <input type="number" className="form-control form-control-glass" name="mes" placeholder="Mes (1-12)" value={filtros.mes} onChange={handleChange} />
                    </div>
                    <div className="col-md-2">
                        <input type="number" className="form-control form-control-glass" name="dia" placeholder="Día" value={filtros.dia} onChange={handleChange} />
                    </div>
                    <div className="col-md-2">
                        <input type="number" className="form-control form-control-glass" name="usuario" placeholder="ID Usuario" value={filtros.usuario} onChange={handleChange} />
                    </div>
                    <div className="col-md-2">
                        <input type="number" className="form-control form-control-glass" name="departamento" placeholder="ID Depto" value={filtros.departamento} onChange={handleChange} />
                    </div>
                    <div className="col-md-2 d-flex">
                        <button type="submit" className="btn btn-premium w-100 rounded-3"><i className="bi bi-search me-2"></i> Buscar</button>
                    </div>
                </form>
            </div>

            <div className="glass-panel overflow-hidden">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Usuario</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Fecha</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Hora Entrada</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Hora Salida</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Dispositivo</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marcas.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-5 text-muted"><i className="bi bi-inbox fs-1 d-block mb-2"></i>No hay registros para mostrar. Utiliza los filtros de arriba para realizar una búsqueda.</td></tr>
                        ) : (
                            marcas.map(m => (
                                <tr key={`${m.usuario_id}-${m.fecha}-${m.turno}`}>
                                    <td className="px-4">{m.usuario}</td>
                                    <td className="px-4">{m.fecha ? new Date(m.fecha).toISOString().split('T')[0] : ''}</td>
                                    <td className="px-4">
                                        {m.hora_entrada
                                            ? <span className="badge rounded-pill bg-success bg-opacity-25 text-success px-3 py-1">{m.hora_entrada}</span>
                                            : <span className="text-muted">—</span>}
                                    </td>
                                    <td className="px-4">
                                        {m.hora_salida
                                            ? <span className="badge rounded-pill bg-danger bg-opacity-25 text-danger px-3 py-1">{m.hora_salida}</span>
                                            : <span className="text-muted">—</span>}
                                    </td>
                                    <td className="px-4">{m.dispositivo_entrada || m.dispositivo_salida || 'N/A'}</td>
                                    <td className="px-4 font-monospace small">{m.ip_entrada || m.ip_salida || 'N/A'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
