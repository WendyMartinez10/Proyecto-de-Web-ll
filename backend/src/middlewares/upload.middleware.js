import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import * as configService from '../models/configuracion.model.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOADS_DIR || 'src/uploads/equipos');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = crypto.randomUUID() + ext;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Se valida tanto el mimetype reportado por el navegador como la
    // extensión del archivo, ya que el mimetype puede ser falsificado por
    // el cliente. Ambos deben coincidir con el conjunto permitido.
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
        return cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG y WEBP.'), false);
    }

    cb(null, true);
};

/**
 * Middleware de subida de imagen de equipo con límite de tamaño dinámico.
 * El límite (en MB) se lee en cada request desde la configuración
 * almacenada en base de datos (clave `tamano_max_archivo_mb`, editable por
 * el administrador desde /api/configuracion), en lugar de quedar fijo con
 * el valor de la variable de entorno leído una sola vez al iniciar el
 * servidor. Si la configuración no está disponible, se usa el respaldo
 * MAX_FILE_SIZE_MB_FALLBACK del .env.
 *
 * Uso: upload.single('imagen')(req, res, next)
 */
export const upload = {
    single: (fieldName) => async (req, res, next) => {
        let maxSizeMb;
        try {
            maxSizeMb = await configService.getTamanoMaxArchivoMb();
        } catch (error) {
            maxSizeMb = parseInt(process.env.MAX_FILE_SIZE_MB_FALLBACK || '5', 10);
        }

        const uploader = multer({
            storage,
            fileFilter,
            limits: {
                fileSize: maxSizeMb * 1024 * 1024,
                files: 1
            }
        }).single(fieldName);

        uploader(req, res, (err) => {
            if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return next(new Error(`El archivo supera el tamaño máximo permitido (${maxSizeMb} MB).`));
            }
            next(err);
        });
    }
};
