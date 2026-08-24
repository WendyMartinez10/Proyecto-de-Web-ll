import { usePerfil } from '../hooks/usePerfil.js';

export const Perfil = () => {
    const {
        user,
        form,
        departamentos,
        msgPerfil,
        errPerfil,
        passForm,
        msgPass,
        errPass,
        handleChangeForm,
        handleChangePass,
        handleSubmitPerfil,
        handleSubmitPassword
    } = usePerfil();

    if (!user) return null;

    return (
        <div className="container mt-4 mb-5 animate-fade-in-up">
            <h2 className="hero-gradient-text fw-bold mb-4">
                <i className="bi bi-person-circle me-2"></i>
                Mi Perfil
            </h2>

            <div className="row g-4">

                {/* =====================================================
                    DATOS PERSONALES
                ====================================================== */}
                <div className="col-lg-6">
                    <div className="glass-panel p-4 h-100">

                        <h5 className="fw-bold mb-3">
                            <i className="bi bi-pencil-square me-2 text-primary"></i>
                            Datos Personales
                        </h5>

                        {/* =================================================
                            CORREO
                        ================================================== */}
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-semibold">
                                Correo (no editable)
                            </label>

                            <input
                                type="email"
                                className="form-control form-control-glass"
                                value={user.correo || ''}
                                disabled
                            />
                        </div>

                        {/* =================================================
                            USUARIO
                        ================================================== */}
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-semibold">
                                Usuario (no editable)
                            </label>

                            <input
                                className="form-control form-control-glass"
                                value={user.nombre_usuario || ''}
                                disabled
                            />
                        </div>

                        {/* =================================================
                            FECHA DE NACIMIENTO
                            Se muestra desde el usuario y no se puede editar.
                        ================================================== */}
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-semibold">
                                Fecha de nacimiento (no editable)
                            </label>

                            <input
                                type="date"
                                className="form-control form-control-glass"
                                value={user.fecha_nacimiento || ''}
                                disabled
                            />
                        </div>

                        {/* =================================================
                            MENSAJES
                        ================================================== */}
                        {errPerfil && (
                            <div className="alert alert-danger p-2 text-center rounded-3 small">
                                {errPerfil}
                            </div>
                        )}

                        {msgPerfil && (
                            <div className="alert alert-success p-2 text-center rounded-3 small">
                                {msgPerfil}
                            </div>
                        )}

                        <form onSubmit={handleSubmitPerfil}>

                            {/* =================================================
                                NOMBRE COMPLETO
                            ================================================== */}
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-semibold">
                                    Nombre completo
                                </label>

                                <input
                                    className="form-control form-control-glass"
                                    name="nombre_completo"
                                    value={form.nombre_completo}
                                    onChange={handleChangeForm}
                                    required
                                />
                            </div>

                            {/* =================================================
                                DEPARTAMENTO / CARRERA
                            ================================================== */}
                            <div className="mb-4">
                                <label className="form-label text-muted small fw-semibold">
                                    Departamento / Carrera
                                </label>

                                <select
                                    className="form-select form-control-glass"
                                    name="departamento_id"
                                    value={form.departamento_id}
                                    onChange={handleChangeForm}
                                >
                                    <option value="">
                                        Sin asignar
                                    </option>

                                    {departamentos.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* =================================================
                                GUARDAR CAMBIOS
                            ================================================== */}
                            <button
                                type="submit"
                                className="btn btn-premium px-4"
                            >
                                <i className="bi bi-check-lg me-2"></i>
                                Guardar Cambios
                            </button>

                        </form>
                    </div>
                </div>

                {/* =====================================================
                    CAMBIAR CONTRASEÑA
                ====================================================== */}
                <div className="col-lg-6">
                    <div className="glass-panel p-4 h-100">

                        <h5 className="fw-bold mb-3">
                            <i className="bi bi-shield-lock me-2 text-primary"></i>
                            Cambiar Contraseña
                        </h5>

                        {errPass && (
                            <div className="alert alert-danger p-2 text-center rounded-3 small">
                                {errPass}
                            </div>
                        )}

                        {msgPass && (
                            <div className="alert alert-success p-2 text-center rounded-3 small">
                                {msgPass}
                            </div>
                        )}

                        <form onSubmit={handleSubmitPassword}>

                            {/* =================================================
                                CONTRASEÑA ACTUAL
                            ================================================== */}
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-semibold">
                                    Contraseña actual
                                </label>

                                <input
                                    type="password"
                                    className="form-control form-control-glass"
                                    name="password_actual"
                                    value={passForm.password_actual}
                                    onChange={handleChangePass}
                                    required
                                />
                            </div>

                            {/* =================================================
                                NUEVA CONTRASEÑA
                            ================================================== */}
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-semibold">
                                    Nueva contraseña
                                </label>

                                <input
                                    type="password"
                                    className="form-control form-control-glass"
                                    name="nueva_password"
                                    value={passForm.nueva_password}
                                    onChange={handleChangePass}
                                    required
                                    minLength={8}
                                />
                            </div>

                            {/* =================================================
                                CONFIRMAR CONTRASEÑA
                            ================================================== */}
                            <div className="mb-4">
                                <label className="form-label text-muted small fw-semibold">
                                    Confirmar nueva contraseña
                                </label>

                                <input
                                    type="password"
                                    className="form-control form-control-glass"
                                    name="confirmar_password"
                                    value={passForm.confirmar_password}
                                    onChange={handleChangePass}
                                    required
                                    minLength={8}
                                />
                            </div>

                            {/* =================================================
                                ACTUALIZAR CONTRASEÑA
                            ================================================== */}
                            <button
                                type="submit"
                                className="btn btn-premium px-4"
                            >
                                <i className="bi bi-key me-2"></i>
                                Actualizar Contraseña
                            </button>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};