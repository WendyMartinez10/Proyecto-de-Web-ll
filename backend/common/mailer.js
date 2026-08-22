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

/**
 * Envía el correo de recuperación de contraseña con el enlace de
 * restablecimiento. Si no hay SMTP configurado, hace un fallback
 * seguro registrando el enlace en consola (útil en desarrollo).
 */
export const sendRecoveryEmail = async ({ to, nombre, resetLink }) => {
    const from = process.env.SMTP_FROM || 'no-reply@marcas-equipos.local';
    const asunto = 'Recuperación de contraseña';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
            <h2 style="color: #4f46e5;">Recuperación de contraseña</h2>
            <p>Hola ${nombre ? nombre : ''},</p>
            <p>Recibimos una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el siguiente botón. Este enlace es válido durante 30 minutos.</p>
            <p style="text-align: center; margin: 24px 0;">
                <a href="${resetLink}" style="background:#4f46e5;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
                    Restablecer contraseña
                </a>
            </p>
            <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all;"><a href="${resetLink}">${resetLink}</a></p>
            <p>Si no solicitaste este cambio, puedes ignorar este correo; tu contraseña seguirá siendo la misma.</p>
        </div>
    `;

    const texto = `Recuperación de contraseña\n\nRecibimos una solicitud para restablecer tu contraseña. Ingresa al siguiente enlace (válido por 30 minutos) para continuar:\n${resetLink}\n\nSi no solicitaste este cambio, ignora este correo.`;

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
