import { useDepartamentos } from '../hooks/useDepartamentos.js';

export const Departamentos = () => {
    const { departamentos, form, editing, error, handleChange, handleSubmit, handleEdit, handleCancel, handleDelete } = useDepartamentos();

    return (
        <div className="container mt-4 mb-5 animate-fade-in-up">
            <h2 className="hero-gradient-text fw-bold mb-4"><i className="bi bi-diagram-3 me-2"></i>Departamentos / Carreras</h2>

            <div className="glass-panel p-4 mb-4">
                <h5 className="fw-bold mb-3">
                    <i className={`bi ${editing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2 text-primary`}></i>
                    {editing ? 'Editar Departamento' : 'Nuevo Departamento'}
                </h5>

                {error && <div className="alert alert-danger p-2 text-center rounded-3 small">{error}</div>}

                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <input type="text" className="form-control form-control-glass" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control form-control-glass" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control form-control-glass" name="encargado" placeholder="Encargado" value={form.encargado} onChange={handleChange} />
                    </div>
                    <div className="col-12 mt-4">
                        <button type="submit" className="btn btn-premium px-4 me-2">{editing ? 'Actualizar' : 'Guardar Departamento'}</button>
                        {editing && <button type="button" className="btn btn-outline-danger px-4" onClick={handleCancel}>Cancelar</button>}
                    </div>
                </form>
            </div>

            <div className="glass-panel overflow-hidden">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Nombre</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Descripción</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Encargado</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departamentos.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-4 text-muted">No hay departamentos registrados.</td></tr>
                        ) : departamentos.map(dep => (
                            <tr key={dep.id}>
                                <td className="px-4 fw-bold">{dep.nombre}</td>
                                <td className="px-4 text-muted">{dep.descripcion || '—'}</td>
                                <td className="px-4">{dep.encargado || '—'}</td>
                                <td className="px-4 text-end">
                                    <button className="btn btn-sm btn-light text-primary me-2 shadow-sm rounded-circle" style={{ width: '32px', height: '32px' }} onClick={() => handleEdit(dep)} title="Editar"><i className="bi bi-pencil"></i></button>
                                    <button className="btn btn-sm btn-light text-danger shadow-sm rounded-circle" style={{ width: '32px', height: '32px' }} onClick={() => handleDelete(dep.id)} title="Eliminar"><i className="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
