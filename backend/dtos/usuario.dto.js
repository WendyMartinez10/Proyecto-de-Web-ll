/**
 * Transforma una fila de la tabla `usuarios` (unida con `roles`) en el
 * objeto público expuesto por GET /api/auth/perfil. Nunca incluye
 * password_hash ni otros campos internos.
 */
export const toUsuarioPublico = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        nombre_completo: row.nombre_completo,
        fecha_nacimiento: row.fecha_nacimiento,
        correo: row.correo,
        nombre_usuario: row.nombre_usuario,
        departamento_id: row.departamento_id,
        rol: row.rol
    };
};

/**
 * Objeto mínimo que se guarda en `req.session.usuario` y se devuelve al
 * cliente justo después de iniciar sesión.
 */
export const toUsuarioSesion = (row) => ({
    id: row.id,
    nombre_usuario: row.nombre_usuario,
    rol: row.rol
});
