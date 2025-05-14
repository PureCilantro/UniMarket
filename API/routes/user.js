import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/DBmanager.js';
import { generatePresignedUrl, uploadFile, deleteFile } from '../middleware/s3manager.js';
const user = express.Router();
//Temp storage for images
import fs from 'fs';
import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'temp/')
    },
    filename: function (req, file, cb) {
        cb(null, path.parse(file.originalname).name + '-' + Date.now() + '.webp')
    }
})
//Endpoints
user.get('/getUserInfo', async (req, res) => {
    const userID = req.headers.userid;
    if (userID) {
        let conn;
        try {
            conn = await pool.getConnection();
            var user = await conn.query('SELECT userID FROM users WHERE userKey = ?;', [req.tokenData.userKey]);
            if (userID === user[0].userID) {
                var row = await conn.query('SELECT name, lastname, email FROM users WHERE userID = ?;', [userID]);
                var avatar = await conn.query('SELECT fileName FROM userImageDetails WHERE userID = ? AND fileName NOT LIKE "%auth%";', [userID]);
                var auth = await conn.query('SELECT fileName FROM userImageDetails WHERE userID = ? AND fileName LIKE "%auth%";', [userID]);
                row[0].avatar = avatar.length === 0 ? '' : await generatePresignedUrl(avatar[0].fileName);
                row[0].auth = auth.length === 0 ? '' : await generatePresignedUrl(auth[0].fileName);
                return res.status(200).json({ info: row[0] });
            } else return res.status(401).json({ message: 'Invalid credentials' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
user.post('/updateUser', async (req, res) => {
    const { name, lastname, email } = req.body;
    if (name && lastname && email) {
        let conn;
        try {
            conn = await pool.getConnection();
            var user = await conn.query('SELECT email FROM users WHERE userKey = ?;', [req.tokenData.userKey]);
            if (email === user[0].email) {
                await conn.query('UPDATE users SET name = ?, lastname = ? WHERE email = ?;', [name, lastname, email]);
                return res.status(200).json({ message: 'User updated' });
            } else return res.status(401).json({ message: 'Invalid credentials' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
user.post('/updatePass', async (req, res) => {
    const { email, oldPassword, newPassword} = req.body;
    if (email && oldPassword && newPassword) {
        let conn;
        try {
            conn = await pool.getConnection();
            var oldHash = await conn.query('SELECT password FROM users WHERE email = ?;', [email]);
            if (bcrypt.compareSync(oldPassword, oldHash[0].password)) {
                var newHash = await bcrypt.hash(newPassword, 12);
                await conn.query('UPDATE users SET password = ? WHERE email = ?;', [newHash, email]);
                return res.status(200).json({ message: 'Password updated' });
            } else return res.status(401).json({ message: 'Invalid credentials' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
user.post('/updateAvatar', multer({ storage }).single('avatar'), async (req, res) => {
    const { email } = req.body;
    if (email && req.file) {
        let conn;
        try {
            conn = await pool.getConnection();
            var user = await conn.query('SELECT email, userID FROM users WHERE userKey = ?;', [req.tokenData.userKey]);
            if (email === user[0].email) {
                var fileName = req.file.filename;
                var oldAvatar = await conn.query('SELECT fileName FROM userImageDetails WHERE userID = ? AND fileName NOT LIKE "%auth%";', [user[0].userID]);
                await conn.beginTransaction();
                await uploadFile(fileName);
                fs.unlinkSync(req.file.path);
                await conn.query('INSERT INTO userImageDetails (userID, fileName) VALUES (?, ?);', [user[0].userID, fileName]);
                if (oldAvatar.length !== 0) {
                    await deleteFile(oldAvatar[0].fileName);
                    await conn.query('DELETE FROM userImageDetails WHERE userID = ? AND fileName = ?;', [user[0].userID, oldAvatar[0].fileName]);
                }
                await conn.commit();
                return res.status(200).json({ message: 'Avatar updated' });
            } else return res.status(401).json({ message: 'Invalid credentials' });
        } catch (error) {
            await conn.rollback();
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
user.post('/updateAuth', multer({ storage }).single('auth'), async (req, res) => {
    const { email } = req.body;
    if (email && req.file) {
        let conn;
        try {
            conn = await pool.getConnection();
            var user = await conn.query('SELECT email, userID FROM users WHERE userKey = ?;', [req.tokenData.userKey]);
            if (email === user[0].email) {
                var fileName = req.file.filename;
                var oldAuth = await conn.query('SELECT fileName FROM userImageDetails WHERE userID = ? AND fileName LIKE "%auth%";', [user[0].userID]);
                await conn.beginTransaction();
                await uploadFile(fileName);
                fs.unlinkSync(req.file.path);
                await conn.query('INSERT INTO userImageDetails (userID, fileName) VALUES (?, ?);', [user[0].userID, fileName]);
                if (oldAuth.length !== 0) {
                    await deleteFile(oldAuth[0].fileName);
                    await conn.query('DELETE FROM userImageDetails WHERE userID = ? AND fileName = ?;', [user[0].userID, oldAuth[0].fileName]);
                }
                await conn.commit();
                return res.status(200).json({ message: 'Auth updated' });
            } else return res.status(401).json({ message: 'Invalid credentials' });
        } catch (error) {
            await conn.rollback();
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
export default user;