import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Verifica la conexión a la base de datos. Se utiliza al arrancar el
 * servidor para informar en consola si la conexión fue exitosa o no,
 * sin detener el proceso (el servidor sigue disponible para reintentar).
 */
export const checkDbConnection = async () => {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        console.log(`Conexión a la base de datos exitosa`);
        return true;
    } catch (error) {
        console.error('No fue posible conectar a la base de datos.');
        console.error(`   Motivo: ${error.message}`);
        console.error('   Verifica que el contenedor de MySQL (docker-compose) esté corriendo y que las variables de entorno en .env sean correctas.');
        return false;
    }
};

export default pool;
