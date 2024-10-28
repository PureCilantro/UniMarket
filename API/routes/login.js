const express = require('express');
const login = express.Router();
const fs = require('fs');
const mariadb = require('mariadb');
const jwt = require('jsonwebtoken');
//db connection config
const dbConfig = JSON.parse(fs.readFileSync('db.key', 'utf8'));
const pool = mariadb.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    connectionLimit: dbConfig.connectionLimit,
    database: dbConfig.database
});
//Endpoints
login.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        let conn = await pool.getConnection();
        try {
            let row = await conn.query('select userID from users where email = ? and password = ?', [email, password]);
            if (row.length === 0) {
                return res.status(401).json({ code: 401, message: 'Invalid credentials' });
            } else {  
                return res.status(200).json({ code: 200, message: row });
            }
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }        
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
login.post('/register', async (req, res) => {
    const { name, lastname, email, password } = req.body;
    if (name && lastname && email && password) {
        const { sha256 } = await import('crypto-hash');
        const newUserID = (await sha256(name + lastname + email)).slice(0, 32);
        let conn = await pool.getConnection();
        try {
            let rows = await conn.query('select userID from users where userID = ?', [newUserID]);
            if (rows.length > 0) {
                return res.status(409).json({ code: 409, message: 'User already exists' });
            } else {
                await conn.query('insert into users values (?,?,?,?,?)', [newUserID, name, lastname, email, password]);
                return res.status(201).json({ code: 201, message: 'User registered' });
            }
        } catch (error) {
            res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
login.post('/getToken', async (req, res) => {
    const { userID } = req.body;
    if (userID) {
        let conn = await pool.getConnection();
        
        if (await conn.query('select userID from users where userID = ?', [userID]).length === 0) {
            return res.status(401).json({ code: 401, message: 'Invalid credentials' });
        } else {
            const token = jwt.sign({
                userID: userID
            }, "debugkey", {
                expiresIn: "60s"
            });
            return res.status(200).json({ code: 200, message: token });
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
module.exports = login;