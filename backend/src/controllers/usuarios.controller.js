import bcrypt from 'bcrypt';
import crypto from 'crypto';
import * as authService from '../models/usuarios.model.js';
import * as departamentosService from '../models/departamentos.model.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { sendRecoveryEmail } from '../utils/mailer.js';

export const register = async (req, res, next) => {
    try {
        const { nombre_completo, fecha_nacimiento, correo, departamento_id, nombre_usuario, password } = req.body;
        
        const existingUser = await authService.findUserByEmailOrUsername(correo);
        const existingUsername = await authService.findUserByEmailOrUsername(nombre_usuario);
        
        if (existingUser || existingUsername) {
            return errorResponse(res, 'El correo o usuario ya está registrado', 409);
        }

        if (departamento_id) {
            const departamento = await departamentosService.getById(departamento_id);
            if (!departamento) {
                return errorResponse(res, 'El departamento seleccionado no existe', 400);
            }
        }

        const password_hash = await bcrypt.hash(password, 10);
        
        await authService.createUser({
            nombre_completo, fecha_nacimiento, correo, departamento_id: departamento_id || null, nombre_usuario, password_hash
        });

        return successResponse(res, { message: 'Usuario registrado exitosamente' }, 201);
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { identificador, password } = req.body;
        
        const user = await authService.findUserByEmailOrUsername(identificador);
        if (!user) {
            return errorResponse(res, 'Credenciales inválidas', 401);
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return errorResponse(res, 'Credenciales inválidas', 401);
        }

        req.session.usuario = {
            id: user.id,
            nombre_usuario: user.nombre_usuario,
            rol: user.rol
        };

        return successResponse(res, { 
            message: 'Inicio de sesión exitoso', 
            usuario: {
                id: user.id,
                nombre_usuario: user.nombre_usuario,
                rol: user.rol
            }
        });
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
        const user = await authService.findUserById(req.session.usuario.id);
        return successResponse(res, user);
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { nombre_completo, fecha_nacimiento, departamento_id } = req.body;

        if (departamento_id) {
            const departamento = await departamentosService.getById(departamento_id);
            if (!departamento) {
                return errorResponse(res, 'El departamento seleccionado no existe', 400);
            }
        }

        await authService.updateUserProfile(req.session.usuario.id, {
            nombre_completo, fecha_nacimiento, departamento_id: departamento_id || null
        });
        return successResponse(res, { message: 'Perfil actualizado' });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { password_actual, nueva_password } = req.body;
        const user = await authService.findUserByEmailOrUsername(req.session.usuario.nombre_usuario);
        
        const isValid = await bcrypt.compare(password_actual, user.password_hash);
        if (!isValid) {
            return errorResponse(res, 'La contraseña actual es incorrecta');
        }

        const hash = await bcrypt.hash(nueva_password, 10);
        await authService.updatePassword(user.id, hash);
        
        return successResponse(res, { message: 'Contraseña actualizada' });
    } catch (error) {
        next(error);
    }
};

export const recoverPassword = async (req, res, next) => {
    try {
        const { identificador } = req.body;
        const user = await authService.findUserByEmailOrUsername(identificador);
        if (!user) {
            return successResponse(res, { message: 'Si el usuario existe, se ha enviado un enlace de recuperación' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expira_en = new Date(Date.now() + 30 * 60000);

        await authService.createRecoveryToken(user.id, token, expira_en);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/restablecer-password?token=${token}`;

        try {
            await sendRecoveryEmail({
                to: user.correo,
                nombre: user.nombre_completo,
                resetLink
            });
        } catch (mailError) {
            // No expone detalles internos del correo al cliente.
            console.error('Error al enviar el correo de recuperación:', mailError.message);
        }

        return successResponse(res, { message: 'Si el usuario existe, se ha enviado un enlace de recuperación' });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token, nueva_password } = req.body;
        
        const tokenData = await authService.findToken(token);
        if (!tokenData) {
            return errorResponse(res, 'Token inválido o expirado');
        }

        const hash = await bcrypt.hash(nueva_password, 10);
        await authService.updatePassword(tokenData.usuario_id, hash);
        await authService.markTokenAsUsed(tokenData.id);

        return successResponse(res, { message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        next(error);
    }
};
