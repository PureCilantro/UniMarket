import express from 'express';
import pool from '../config/DBmanager.js';
const create = express.Router();
//temp storage for images
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
create.post('/postPost', multer({ storage }).array('files', 4) , async (req, res) => {//Best name
    const { title, description, quantity, price, availableFrom, availableTo, categories } = req.body;
    if ( title && description && quantity && price && availableFrom && availableTo && categories && req.files.length > 0) {
        let conn;
        try {
            conn = await pool.getConnection();
            var user = await conn.query('SELECT userID FROM users WHERE userKey = ?;', [req.tokenData.userKey]);
            await conn.beginTransaction();
            var row = await conn.query('INSERT INTO posts (userID, title, description, quantity, price, availableFrom, availableTo, active) VALUES (?,?,?,?,?,?,?,?);', [user[0].userID, title, description, quantity, price, availableFrom, availableTo , 0]);
            var cats = categories.split(',');
            for (const cat of cats) {
                await conn.query('INSERT INTO postCategoryDetails (postID, categoryID) VALUES (?, ?);', [row.insertId, cat]);
            }
            var postID = row.insertId;
            for (const file of req.files) {
                //upload to bucket
                await conn.query('INSERT INTO postImageDetails (postID, fileName) VALUES (?, ?);', [postID, file.filename]);
            }
            await conn.commit();
            return res.status(201).json({ message: 'Post created', ID: row.insertId.toString() });
        } catch (error) {
            await conn.rollback();
            for (const file of req.files) {
                fs.unlinkSync('temp/' + file.filename);
            }
            res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
create.post('/editPost', async (req, res) => {
    const { postID, title, description, quantity, price, availableFrom, availableTo } = req.body;
    if (postID && title && description && quantity && price && availableFrom && availableTo) {
        let conn;
        try {
            conn = await pool.getConnection();
            var post = await conn.query('SELECT userID FROM posts WHERE postID = ?', [postID]);
            var user = await conn.query('SELECT userID FROM users WHERE userKey = ?;', [req.tokenData.userKey]);
            if (post.length === 0 || user[0].userID !== post[0].userID) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } else {
                await conn.query('UPDATE posts SET title = ?, description = ?, quantity = ?, price = ?, availableFrom = ?, availableTo = ? WHERE postID = ?;', [title, description, quantity, price, availableFrom, availableTo, postID]);
                return res.status(200).json({ message: 'Post updated' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
create.post('/togglePost', async (req, res) => {
    const { postID } = req.body;
    if (postID) {
        let conn;
        try {
            conn = await pool.getConnection();
            var post = await conn.query('SELECT userID, active FROM posts WHERE postID = ?;', [postID]);
            var user = await conn.query('SELECT userID FROM users WHERE userKey = ?;', [req.tokenData.userKey]);
            if (post.length === 0 || user[0].userID !== post[0].userID) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } else {
                if (post[0].active === 0) {
                    await conn.query('UPDATE posts SET active = 1 WHERE postID = ?;', [postID]);
                } else {
                    await conn.query('UPDATE posts SET active = 0 WHERE postID = ?;', [postID]);
                }
                return res.status(200).json({ message: 'Post updated' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
create.post('/deletePost', async (req, res) => {
    const { postID } = req.body;
    if (postID) {
        let conn;
        try {
            conn = await pool.getConnection();
            var post = await conn.query('SELECT userID FROM posts WHERE postID = ?;', [postID]);
            var user = await conn.query('SELECT userID FROM users WHERE userKey = ?;', [req.tokenData.userKey]);
            if (post.length === 0 || user[0].userID !== post[0].userID) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } else {
                var images = await conn.query('SELECT fileName FROM postImageDetails WHERE postID = ?;', [postID]);
                if (images.length > 0) {
                    //delete from bucket
                    for (let i = 0; i < images.length; i++) {
                        fs.unlinkSync('temp/' + images[i].fileName)
                    }
                }
                conn.beginTransaction();
                await conn.query('DELETE FROM postCategoryDetails WHERE postID = ?;', [postID]);
                await conn.query('DELETE FROM postImageDetails WHERE postID = ?;', [postID]);
                await conn.query('DELETE FROM posts WHERE postID = ?;', [postID]);
                conn.commit();
                return res.status(200).json({ message: 'Post deleted' });
            }
        } catch (error) {
            conn.rollback();
            res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
create.post('/addPostImage', multer({ storage }).single('file'), async (req, res) => {
    const { postID } = req.body;
    if (postID && req.file) {
        let conn;
        try {
            conn = await pool.getConnection();
            var post = await conn.query('SELECT userID FROM posts WHERE postID = ?;', [postID]);
            var user = await conn.query('SELECT userID FROM users WHERE userKey = ?;', [req.tokenData.userKey]);
            if (post.length === 0 || user[0].userID !== post[0].userID) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } else {
                await conn.beginTransaction();
                await conn.query('INSERT INTO postImageDetails (postID, fileName) VALUES (?, ?);', [postID, req.file.filename]);
                //upload to bucket
                await conn.commit();
                return res.status(200).json({ message: 'Post image added' });
            }
        } catch (error) {
            await conn.rollback();
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
create.post('/deletePostImage', async (req, res) => {
    const {postID, fileName } = req.body;
    if (postID && fileName) {
        let conn;
        try {
            conn = await pool.getConnection();
            var post = await conn.query('SELECT userID FROM posts WHERE postID = ?;', [postID]);
            var user = await conn.query('SELECT userID FROM users WHERE userKey = ?;', [req.tokenData.userKey]);
            if (post.length === 0 || user[0].userID !== post[0].userID) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } else {
                var image = await conn.query('SELECT fileName FROM postImageDetails WHERE postID = ? AND fileName = ?;', [postID, fileName]);
                if (image.length === 0) {
                    return res.status(404).json({ message: 'Image not found' });
                } else {
                    //delete from bucket
                    fs.unlinkSync('temp/' + fileName);
                    await conn.query('DELETE FROM postImageDetails WHERE postID = ? AND fileName = ?;', [postID, fileName]);
                    return res.status(200).json({ message: 'Post image deleted' });
                }
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
export default create;