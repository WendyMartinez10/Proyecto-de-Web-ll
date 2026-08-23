import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;

/**
 * Crea (una sola vez) y retorna el transporter de nodemailer configurado
 * a partir de las variables de entorno SMTP_*. Si las variables no están
 * configuradas, retorna null y el envío se registra únicamente en consola,
 * de modo que el entorno de desarrollo no se rompa por falta de credenciales.
 */
const getTransporter = () => {
    if (transporter) return transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        return null;
    }

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true', // true para puerto 465, false para el resto
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });

    return transporter;
};

import { getRecoveryEmailHtml, getRecoveryEmailText } from './templates/emailTemplates.js';

/**
 * Envía el correo de recuperación de contraseña con el enlace de
 * restablecimiento. Si no hay SMTP configurado, hace un fallback
 * seguro registrando el enlace en consola (útil en desarrollo).
 */
export const sendRecoveryEmail = async ({ to, nombre, resetLink }) => {
    const from = process.env.SMTP_FROM || 'no-reply@marcas-equipos.local';
    const asunto = 'Recuperación de contraseña';

    const html = getRecoveryEmailHtml(nombre, resetLink);
    const texto = getRecoveryEmailText(resetLink);

    const activeTransporter = getTransporter();

    if (!activeTransporter) {
        console.warn('[mailer] SMTP no configurado (SMTP_HOST/SMTP_USER/SMTP_PASS). Se muestra el enlace en consola en lugar de enviarse por correo:');
        console.warn(`[mailer] Destinatario: ${to} | Enlace: ${resetLink}`);
        return { simulated: true };
    }

    const info = await activeTransporter.sendMail({
        from,
        to,
        subject: asunto,
        text: texto,
        html
    });

    return info;
};

export default { sendRecoveryEmail };
