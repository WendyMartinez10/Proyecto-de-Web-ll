import bcrypt from 'bcrypt';
import crypto from 'crypto';
import * as usuariosModel from '../models/usuarios.model.js';
import * as departamentosModel from '../models/departamentos.model.js';
import { sendRecoveryEmail } from '../common/mailer.js';
import { AppError } from '../common/AppError.js';
import { toUsuarioPublico, toUsuarioSesion } from '../dtos/usuario.dto.js';

export const registrarUsuario = async ({ nombre_completo, fecha_nacimiento, correo, departamento_id, nombre_usuario, password }) => {
    const existingUser = await usuariosModel.findUserByEmailOrUsername(correo);
    const existingUsername = await usuariosModel.findUserByEmailOrUsername(nombre_usuario);

    if (existingUser || existingUsername) {
        throw new AppError('El correo o usuario ya está registrado', 409);
    }

    if (departamento_id) {
        const departamento = await departamentosModel.getById(departamento_id);
        if (!departamento) {
            throw new AppError('El departamento seleccionado no existe', 400);
        }
    }

    const password_hash = await bcrypt.hash(password, 10);

    await usuariosModel.createUser({
        nombre_completo,
        fecha_nacimiento,
        correo,
        departamento_id: departamento_id || null,
        nombre_usuario,
        password_hash
    });
};

export const autenticar = async ({ identificador, password }) => {
    const user = await usuariosModel.findUserByEmailOrUsername(identificador);
    if (!user) throw new AppError('Credenciales inválidas', 401);

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new AppError('Credenciales inválidas', 401);

    return toUsuarioSesion(user);
};

export const obtenerPerfil = async (usuarioId) => {
    const user = await usuariosModel.findUserById(usuarioId);
    return toUsuarioPublico(user);
};

export const actualizarPerfil = async (usuarioId, { nombre_completo, fecha_nacimiento, departamento_id }) => {
    if (departamento_id) {
        const departamento = await departamentosModel.getById(departamento_id);
        if (!departamento) {
            throw new AppError('El departamento seleccionado no existe', 400);
        }
    }

    await usuariosModel.updateUserProfile(usuarioId, {
        nombre_completo,
        fecha_nacimiento,
        departamento_id: departamento_id || null
    });
};

export const cambiarPassword = async (nombreUsuarioSesion, { password_actual, nueva_password }) => {
    const user = await usuariosModel.findUserByEmailOrUsername(nombreUsuarioSesion);

    const isValid = await bcrypt.compare(password_actual, user.password_hash);
    if (!isValid) {
        throw new AppError('La contraseña actual es incorrecta', 400);
    }

    const hash = await bcrypt.hash(nueva_password, 10);
    await usuariosModel.updatePassword(user.id, hash);
};

export const solicitarRecuperacion = async ({ identificador }) => {
    const user = await usuariosModel.findUserByEmailOrUsername(identificador);
    if (!user) {
        // No revela si el usuario existe o no (evita enumeración de cuentas).
        return;
    }

    const token = crypto.randomBytes(32).toString('hex');

    await usuariosModel.createRecoveryToken(user.id, token);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/restablecer-password?token=${token}`;

    try {
        await sendRecoveryEmail({ to: user.correo, nombre: user.nombre_completo, resetLink });
    } catch (mailError) {
        // No expone detalles internos del correo al cliente.
        console.error('Error al enviar el correo de recuperación:', mailError.message);
    }
};

export const restablecerPassword = async ({ token, nueva_password }) => {
    const tokenData = await usuariosModel.findToken(token);
    if (!tokenData) {
        throw new AppError('Token inválido o expirado', 400);
    }

    const hash = await bcrypt.hash(nueva_password, 10);
    await usuariosModel.updatePassword(tokenData.usuario_id, hash);
    await usuariosModel.markTokenAsUsed(tokenData.id);
};
