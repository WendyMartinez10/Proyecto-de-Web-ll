import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { checkDbConnection } from './config/db.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    await checkDbConnection();
});
