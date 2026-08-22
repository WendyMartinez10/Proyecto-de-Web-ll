import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pool, { checkDbConnection } from './config/db.js';

dotenv.config();
import { crearSesion } from './config/session.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import departamentosRoutes from './routes/departamentos.routes.js';
import dispositivosRoutes from './routes/dispositivos.routes.js';
import marcasRoutes from './routes/marcas.routes.js';
import equiposRoutes from './routes/equipos.routes.js';
import prestamosRoutes from './routes/prestamos.routes.js';
import configuracionRoutes from './routes/configuracion.routes.js';
import * as configuracionModel from './models/configuracion.model.js';

/**
 * Configura y exporta la aplicación Express (rutas, middlewares, manejo
 * de errores). No inicia el servidor: eso ocurre en index.js, para poder
 * importar `app` en pruebas sin abrir un puerto real.
 */
const app = express();

// Confía en HTTPS solo cuando existe un proxy configurado.
if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(crearSesion(pool));

// Aplica el tiempo de sesión definido por el administrador.
app.use(async (req, res, next) => {
    if (req.session) {
        try {
            const minutos = await configuracionModel.getTiempoMaxSesionMin();
            req.session.cookie.maxAge = minutos * 60 * 1000;
        } catch (error) {
            console.error('No se pudo leer el tiempo máximo de sesión:', error.message);
        }
    }
    next();
});

// Publica las imágenes de equipos en modo lectura.
const uploadsDir = path.resolve(process.cwd(), process.env.UPLOADS_DIR || 'uploads/equipos');
app.use('/uploads/equipos', express.static(uploadsDir));

app.use('/api/auth', usuariosRoutes);
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/dispositivos', dispositivosRoutes);
app.use('/api/marcas', marcasRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/prestamos', prestamosRoutes);
app.use('/api/configuracion', configuracionRoutes);

app.get('/api/ping', (req, res) => res.json({ message: 'API funcionando' }));

app.get('/api/health', async (req, res) => {
    const dbConectada = await checkDbConnection();
    res.status(dbConectada ? 200 : 503).json({
        success: dbConectada,
        api: 'up',
        database: dbConectada ? 'connected' : 'disconnected'
    });
});

app.use(errorMiddleware);

export default app;
