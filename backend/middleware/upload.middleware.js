import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import * as configService from '../models/configuracion.model.js';

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp'
];

const ALLOWED_EXTENSIONS = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp'
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(
            null,
            process.env.UPLOADS_DIR || 'uploads/equipos'
        );
    },

    filename: (req, file, cb) => {
        const ext = path
            .extname(file.originalname)
            .toLowerCase();

        const uniqueName =
            `${crypto.randomUUID()}${ext}`;

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path
        .extname(file.originalname)
        .toLowerCase();

    if (
        !ALLOWED_MIME_TYPES.includes(file.mimetype) ||
        !ALLOWED_EXTENSIONS.includes(ext)
    ) {
        return cb(
            new Error(
                'Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG y WEBP.'
            ),
            false
        );
    }

    cb(null, true);
};

/**
 * Comprueba la firma real del archivo.
 *
 * JPEG: FF D8 FF
 * PNG: 89 50 4E 47
 * WEBP: RIFF....WEBP
 */
const validarContenidoImagen = async (filePath, extension) => {
    const buffer = await fs.readFile(filePath);

    if (extension === '.jpg' || extension === '.jpeg') {
        return (
            buffer.length >= 3 &&
            buffer[0] === 0xff &&
            buffer[1] === 0xd8 &&
            buffer[2] === 0xff
        );
    }

    if (extension === '.png') {
        return (
            buffer.length >= 8 &&
            buffer[0] === 0x89 &&
            buffer[1] === 0x50 &&
            buffer[2] === 0x4e &&
            buffer[3] === 0x47 &&
            buffer[4] === 0x0d &&
            buffer[5] === 0x0a &&
            buffer[6] === 0x1a &&
            buffer[7] === 0x0a
        );
    }

    if (extension === '.webp') {
        return (
            buffer.length >= 12 &&
            buffer.toString('ascii', 0, 4) === 'RIFF' &&
            buffer.toString('ascii', 8, 12) === 'WEBP'
        );
    }

    return false;
};

/**
 * Middleware de subida de imágenes de equipos.
 *
 * Valida:
 * - extensión;
 * - MIME;
 * - tamaño;
 * - nombre único;
 * - contenido real del archivo.
 *
 * El tamaño máximo se obtiene de la configuración de la base de datos.
 */
export const upload = {
    single: (fieldName) => async (req, res, next) => {
        let maxSizeMb;

        try {
            maxSizeMb =
                await configService.getTamanoMaxArchivoMb();
        } catch (error) {
            maxSizeMb = parseInt(
                process.env.MAX_FILE_SIZE_MB_FALLBACK || '5',
                10
            );
        }

        const uploader = multer({
            storage,
            fileFilter,
            limits: {
                fileSize: maxSizeMb * 1024 * 1024,
                files: 1
            }
        }).single(fieldName);

        uploader(req, res, async (err) => {
            if (
                err instanceof multer.MulterError &&
                err.code === 'LIMIT_FILE_SIZE'
            ) {
                return next(
                    new Error(
                        `El archivo supera el tamaño máximo permitido (${maxSizeMb} MB).`
                    )
                );
            }

            if (err) {
                return next(err);
            }

            if (!req.file) {
                return next();
            }

            try {
                const extension = path
                    .extname(req.file.originalname)
                    .toLowerCase();

                const imagenValida =
                    await validarContenidoImagen(
                        req.file.path,
                        extension
                    );

                if (!imagenValida) {
                    await fs.unlink(req.file.path).catch(() => {});

                    return next(
                        new Error(
                            'El contenido del archivo no corresponde a una imagen JPG, PNG o WEBP válida.'
                        )
                    );
                }

                next();
            } catch (error) {
                if (req.file?.path) {
                    await fs
                        .unlink(req.file.path)
                        .catch(() => {});
                }

                next(
                    new Error(
                        'No fue posible validar la imagen.'
                    )
                );
            }
        });
    }
};