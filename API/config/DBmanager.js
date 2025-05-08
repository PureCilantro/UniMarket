import mariadb from 'mariadb';
import dotenv from 'dotenv';
dotenv.config();
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONNLIMIT
});
export default pool;