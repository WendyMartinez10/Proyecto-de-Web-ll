/**
 * Plantillas HTML y de texto para el correo de recuperación de contraseña.
 * Separado de la lógica del backend para mantener una arquitectura limpia.
 */

export const getRecoveryEmailHtml = (nombre, resetLink) => `
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

export const getRecoveryEmailText = (resetLink) => `
Recuperación de contraseña

Recibimos una solicitud para restablecer tu contraseña. Ingresa al siguiente enlace (válido por 30 minutos) para continuar:
${resetLink}

Si no solicitaste este cambio, ignora este correo.
`;
