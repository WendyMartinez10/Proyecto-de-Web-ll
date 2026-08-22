import * as usuariosService from '../services/usuarios.service.js';
import { successResponse, errorResponse } from '../common/response.js';

export const register = async (req, res, next) => {
    try {
        await usuariosService.registrarUsuario(req.body);
        return successResponse(res, { message: 'Usuario registrado exitosamente' }, 201);
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const usuarioSesion = await usuariosService.autenticar(req.body);
        req.session.usuario = usuarioSesion;
        return successResponse(res, { message: 'Inicio de sesión exitoso', usuario: usuarioSesion });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return errorResponse(res, 'Error al cerrar sesión', 500);
        res.clearCookie('sesion_usuario');
        return successResponse(res, { message: 'Sesión finalizada' });
    });
};

export const getProfile = async (req, res, next) => {
    try {
        const user = await usuariosService.obtenerPerfil(req.session.usuario.id);
        return successResponse(res, user);
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        await usuariosService.actualizarPerfil(req.session.usuario.id, req.body);
        return successResponse(res, { message: 'Perfil actualizado' });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        await usuariosService.cambiarPassword(req.session.usuario.nombre_usuario, req.body);
        return successResponse(res, { message: 'Contraseña actualizada' });
    } catch (error) {
        next(error);
    }
};

export const recoverPassword = async (req, res, next) => {
    try {
        await usuariosService.solicitarRecuperacion(req.body);
        return successResponse(res, { message: 'Si el usuario existe, se ha enviado un enlace de recuperación' });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        await usuariosService.restablecerPassword(req.body);
        return successResponse(res, { message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        next(error);
    }
};
