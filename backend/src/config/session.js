import session from 'express-session';
import expressMysqlSession from 'express-mysql-session';

/**
 * Configura las sesiones persistidas en MySQL y la cookie segura.
 */
export const crearSesion = (pool) => {
    const MySQLStore = expressMysqlSession(session);
    const duracionBase = 24 * 60 * 60 * 1000;

    const sessionStore = new MySQLStore({
        clearExpired: true,
        checkExpirationInterval: 900000,
        expiration: duracionBase,
        createDatabaseTable: false,
        schema: {
            tableName: 'sesiones',
            columnNames: { session_id: 'session_id', expires: 'expires', data: 'data' }
        }
    }, pool);

    const cookieSecure =
        process.env.NODE_ENV === 'production' ||
        process.env.COOKIE_SECURE === 'true';

    return session({
        key: 'sesion_usuario',
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: duracionBase,
            httpOnly: true,
            sameSite: 'lax',
            secure: cookieSecure
        }
    });
};
