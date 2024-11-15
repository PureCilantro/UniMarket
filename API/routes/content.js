const express = require('express');
const content = express.Router();
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
content.get('/getCategories', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query('select * from categories;');
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
    } finally {
        if (conn) conn.release();
    }
});
content.get('/getPosts', async (req, res) => {
    const { time , row } = req.query;
    if (time && row) {
        let conn;
        try {
            conn = await pool.getConnection();
            let rows = await conn.query('select * from posts where active = 1 and availableFrom <= ? and availableTo >= ? and postID > ? limit 5;', [time, time, row]);
            for (let i = 0; i < rows.length; i++) {
                let coverImages = await conn.query('select fileName from postImageDetails where postID = ? and filename like "cover%";', [rows[i].postID]);
                let otherImages = await conn.query('select fileName from postImageDetails where postID = ? and filename not like "cover%";', [rows[i].postID]);
                rows[i].images = coverImages.concat(otherImages);
            }
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else {
        return res.status(400).json({ code: 400, message: 'Incomplete data' });
    }
});
content.get('/getUserPosts', async (req, res) => {
    const { userID } = req.query;
    if (userID && req.tokenData.userID === userID) {
        let conn;
        try {
            conn = await pool.getConnection();
            let rows = await conn.query('select * from posts where userID = ?;', [userID]);
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
content.get('/getPostsByCategory', async (req, res) => {
    const { time, cats, row } = req.query;
    if (cats) {
        let conn;
        const categories = JSON.parse(cats).id;
        try {
            conn = await pool.getConnection();
            let rows = await conn.query('select p.* from posts p join postCategoryDetails c on p.postID = c.postID where c.categoryID in (?) and p.active = 1 and p.availableFrom <= ? and p.availableTo >= ? and p.postID > ? order by p.postID limit 5;', [categories.toString(), time, time, row]);
            return res.status(200).json({ code: 200, message: rows });
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
content.post('/postPost', async (req, res) => {//Best name
    const { userID, title, description, quantity, price, availableFrom, availableTo } = req.body;
    if (userID && title && description && quantity && price && availableFrom && availableTo) {
        let conn;
        try {
            conn = await pool.getConnection();
            if (req.tokenData.userID !== userID) {
                return res.status(401).json({ code: 401, message: 'Invalid credentials' });
            } else {
                let row = await conn.query('insert into posts (userID, title, description, quantity, price, availableFrom, availableTo, active) values (?,?,?,?,?,?,?,?);', [userID, title, description, quantity, price, availableFrom, availableTo , 0]);
                console.log(row);
                return res.status(201).json({ code: 201, message: 'Post created', ID: row.insertId.toString() });
            }
        } catch (error) {
            res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
content.post('/editPost', async (req, res) => {
    const { postID, userID, title, description, quantity, price, availableFrom, availableTo } = req.body;
    if (postID && userID && title && description && quantity && price && availableFrom && availableTo) {
        let conn;
        try {
            conn = await pool.getConnection();
            let row = await conn.query('select userID from posts where postID = ? and userID = ?', [postID, userID]);
            if (row.length === 0 || row[0].userID !== req.tokenData.userID) {
                return res.status(401).json({ code: 401, message: 'Invalid credentials' });
            } else {
                await conn.query('update posts set title = ?, description = ?, quantity = ?, price = ?, availableFrom = ?, availableTo = ? where postID = ? and userID = ?;', [title, description, quantity, price, availableFrom, availableTo, postID, userID]);
                return res.status(200).json({ code: 200, message: 'Post updated' });
            }
        } catch (error) {
            res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
content.post('/togglePost', async (req, res) => {
    const { postID, userID } = req.body;
    if (postID && userID) {
        let conn;
        try {
            conn = await pool.getConnection();
            let row = await conn.query('select userID, active from posts where postID = ? and userID = ?;', [postID, userID]);
            if (row.length === 0 || row[0].userID !== req.tokenData.userID) {
                return res.status(401).json({ code: 401, message: 'Invalid credentials' });
            } else {
                if (row[0].active === 0) {
                    await conn.query('update posts set active = 1 where postID = ? and userID = ?;', [postID, userID]);
                } else {
                    await conn.query('update posts set active = 0 where postID = ? and userID = ?;', [postID, userID]);
                }
                return res.status(200).json({ code: 200, message: 'Post updated' });
            }
        } catch (error) {
            res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
content.post('/deletePost', async (req, res) => {
    const { postID, userID } = req.body;
    if (postID && userID) {
        let conn;
        try {
            conn = await pool.getConnection();
            let row = await conn.query('select userID from posts where postID = ? and userID = ?;', [postID, userID]);
            if (row.length === 0 || row[0].userID !== req.tokenData.userID) {
                return res.status(401).json({ code: 401, message: 'Invalid credentials' });
            } else {
                conn.beginTransaction();
                await conn.query('delete from posts where postID = ? and userID = ?;', [postID, userID]);
                await conn.query('delete from postImageDetails where postID = ?;', [postID]);
                conn.commit();
                return res.status(200).json({ code: 200, message: 'Post deleted' });
            }
        } catch (error) {
            conn.rollback();
            res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
content.post('/registerPostPicture', async (req, res) => {
    const {postID, userID, fileName } = req.body;
    if (postID && userID && fileName) {
        let conn;
        try {
            conn = await pool.getConnection();
            let row = await conn.query('select userID from posts where postID = ? and userID = ?;', [postID, userID]);
            if (row.length === 0 || row[0].userID !== req.tokenData.userID) {
                return res.status(401).json({ code: 401, message: 'Invalid credentials' });
            } else {
                await conn.query('insert into postImageDetails values (?,?);', [postID, fileName]);
                return res.status(201).json({ code: 201, message: 'Image registered' });
            } 
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
content.post('/deletePostPicture', async (req, res) => {
    const {postID, userID, fileName } = req.body;
    if (postID && userID && fileName) {
        let conn;
        try {
            conn = await pool.getConnection();
            let row = await conn.query('select userID from posts where postID = ? and userID = ?;', [postID, userID]);
            if (row.length === 0 || row[0].userID !== req.tokenData.userID) {
                return res.status(401).json({ code: 401, message: 'Invalid credentials' });
            } else {  
                fs.unlink('uploads/' + fileName, (error) => {
                    if (error) return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
                });
                await conn.query('delete from postImageDetails where postID = ? and fileName = ?;', [postID, fileName]);
                return res.status(200).json({ code: 200, message: 'Image deleted' });
            }
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.release();
        }
    } else return res.status(400).json({ code: 400, message: 'Incomplete data' });
});
module.exports = content;