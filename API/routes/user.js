const express = require('express');
const user = express.Router();
const fs = require('fs');
const mariadb = require('mariadb');
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
user.get('/getUserInfo', async (req, res) => {
    const { userID } = req.query;
    if (userID) {
        let conn;
        try {
            if (userID === req.tokenData.userID) {
                conn = await pool.getConnection();
                let row = await conn.query('select name, lastname, email from users where userID = ?;', [userID]);
                let avatar = await conn.query('select fileName from userImageDetails where userID = ? and fileName not like "%auth%";', [userID]);
                let auth = await conn.query('select fileName from userImageDetails where userID = ? and fileName like "%auth%";', [userID]);
                row[0].avatar = avatar.length === 0 ? '' : avatar[0].fileName;
                row[0].auth = auth.length === 0 ? '' : auth[0].fileName;
                if (row.length === 0) {
                    return res.status(404).json({ code: 404, message: 'User not found' });
                } else {
                    return res.status(200).json({ code: 200, message: row[0] });
                }
            }
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
user.post('/updatePass', async (req, res) => {
    const { email, oldPassword, newPassword} = req.body;
    if (email && oldPassword && newPassword) {
        let conn;
        try {
            conn = await pool.getConnection();
            let row = await conn.query('select userID from users where email = ? and password = ?;', [email, oldPassword]);
            if (row.length === 0 || row[0].userID !== req.tokenData.userID) {
                return res.status(401).json({ code: 401, message: 'Invalid credentials' });
            } else {  
                await conn.query('update users set password = ? where email = ? and password = ?;', [newPassword, email, oldPassword]);
                return res.status(200).json({ code: 200, message: 'Password updated' });
            } 
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
user.post('/registerUserPicture', async (req, res) => {
    const { userID, fileName } = req.body;
    if (userID && fileName) {
        let conn;
        try {
            conn = await pool.getConnection();
            let row = await conn.query('select userID from users where userID = ?;', [userID]);
            console.log(userID, req.tokenData.userID);
            if (row.length === 0 || row[0].userID !== req.tokenData.userID) {
                return res.status(401).json({ code: 401, message: 'Invalid credentials' });
            } else {  
                let row = await conn.query('select fileName from userImageDetails where userID = ? and fileName not like "%auth%";', [userID]);
                if (row.length === 0) {
                    await conn.query('insert into userImageDetails values (?,?)', [userID, fileName]);
                    return res.status(200).json({ code: 200, message: 'Picture registered' });
                } else {
                    fs.unlink('users/' + row[0].fileName, (err) => {
                        if (err) return res.status(500).json({ code: 500, message: 'Internal server error: ' + err });
                    });
                    await conn.query('update userImageDetails set fileName = ? where userID = ? and fileName = ?;', [fileName, userID, row[0].fileName]);
                    return res.status(200).json({ code: 200, message: 'Picture updated' });
                }
            } 
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
user.post('/resgisterAuthPicture', async (req, res) => {
    const { userID, fileName } = req.body;
    if (userID && fileName) {
        let conn;
        try {
            conn = await pool.getConnection();
            let row = await conn.query('select userID from users where userID = ?;', [userID]);
            if (row.length === 0 || row[0].userID !== req.tokenData.userID) {
                return res.status(401).json({ code: 401, message: 'Invalid credentials' });
            } else {  
                let row = await conn.query('select fileName from userImageDetails where userID = ? and fileName like "%auth%";', [userID]);
                if (row.length === 0) {
                    await conn.query('insert into userImageDetails values (?,?)', [userID, fileName]);
                    return res.status(200).json({ code: 200, message: 'Picture registered' });
                } else {
                    fs.unlink('users/' + row[0].fileName, (err) => {
                        if (err) return res.status(500).json({ code: 500, message: 'Internal server error: ' + err });
                    });
                    await conn.query('update userImageDetails set fileName = ? where userID = ? and fileName = ?;', [fileName, userID, row[0].fileName]);
                    return res.status(200).json({ code: 200, message: 'Picture updated' });
                }
            } 
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
module.exports = user;