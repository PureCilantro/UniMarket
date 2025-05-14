//Dependencies
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import pool from './config/DBmanager.js';
import { checkBucketConnection } from './middleware/s3manager.js';
dotenv.config();
//Routes
import login from './routes/login.js';
import user from './routes/user.js';
import content from './routes/content.js';
import create from './routes/create.js';
//Middleware
import auth from './middleware/auth.js';
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Endpoints
app.use('/login', login);
app.use('/user', auth, user);
app.use('/content', auth, content);
app.use('/create', auth, create);

app.get('/', (req, res) => {
    res.send('Hi there! Im alive!');
});

app.get('/health', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let tables = await conn.query('SHOW tables;');
        var tempExists = '';
        fs.existsSync('./temp') ? tempExists = 'exists' : tempExists = 'does not exist';
        var bucketOK = await checkBucketConnection();
        res.status(200).send({ message: 'Reading '+ tables.length + ' tables, temp folder ' + tempExists + ', bucket conn: ' + bucketOK });
    } catch (error) {
        res.status(500).send({ message: 'DB not connected: ' + error });
    } finally {
        if (conn) conn.end();
    }
});

app.use((req, res, next) => {
    res.status(404).send({ message: 'Not found' });
});

app.listen(process.env.PORT || 3200, () => {
    console.log('Server is running...');
})