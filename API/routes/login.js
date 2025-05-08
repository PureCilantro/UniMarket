//Dependencies
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import pool from '../config/DBmanager.js';
const login = express.Router();

//Endpoints
login.post('/register', async (req, res) => {
    const { name, lastname, email, password } = req.body;
    if (name && lastname && email && password) {
        let conn;
        try {
            conn = await pool.getConnection();
            let rows = await conn.query('SELECT email FROM users WHERE email = ?;', [email]);
            if (rows.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            } else {
                var encString = name + lastname + email + Date.now()
                var userID = crypto.createHash("sha256").setEncoding("hex")
                    .update(encString)
                    .digest("hex").slice(0, 32);
                var userKey = crypto.createHash('md5').update(encString).digest('hex');
                var pwHash = await bcrypt.hash(password, 12);
                await conn.query('insert into users values (?,?,?,?,?,?)', [userID, userKey, name, lastname, email, pwHash]);
                return res.status(201).json({ message: 'User registered' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
login.post('/', async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        let conn;
        try {
            conn = await pool.getConnection();
            let hash = await conn.query('SELECT password FROM users WHERE email = ?;', [email]);
            if ((hash.length !== 0) && (await bcrypt.compare(password, hash[0].password))) {
                let row = await conn.query('SELECT userKey FROM users WHERE email = ?;', [email]);
                return res.status(200).json({ userKey: row[0].userKey });
            } else {  
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            conn.end();
        }        
    } else return res.status(400).json({ message: 'Incomplete data' });
});
login.get('/getToken', async (req, res) => {
    const userKey = req.headers.userkey;
    if (userKey) {
        let conn;
        try {
            conn = await pool.getConnection();
            let rows = await conn.query('SELECT userKey FROM users WHERE userKey = ?;', [userKey]);
            if (rows.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } else {
                const token = jwt.sign({
                    userKey: userKey
                }, process.env.SECRET_TOKEN, {
                    expiresIn: "1h"
                });
                return res.status(200).json({ token: token });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            conn.end();
        }        
    } else return res.status(400).json({ message: 'Incomplete data' });
});
export default login;