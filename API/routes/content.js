import express from 'express';
import pool from '../config/DBmanager.js';
const content = express.Router();
//Endpoints
content.get('/getCategories', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query('SELECT * FROM categories;');
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error: ' + error });
    } finally {
        if (conn) conn.end();
    }
});
content.get('/getPostIDs', async (req, res) => {
    const time = req.headers.time;
    const categories = req.headers.categories;
    if (time) {
        let conn;
        let cats = [];
        try {
            conn = await pool.getConnection();
            if (categories)  cats = categories.split(',').map(Number);
            if (cats.length > 0) {
                var rows = await conn.query('SELECT p.postID FROM posts p JOIN postCategoryDetails c ON p.postID = c.postID WHERE c.categoryID IN (?) AND p.active = 1 AND p.availableFrom <= ? AND p.availableTo >= ?;', [cats, time, time]);
            } else {
                var rows = await conn.query('SELECT postID FROM posts WHERE active = 1 AND availableFrom <= ? AND availableTo >= ?;', [time, time]);
            }
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else {
        return res.status(400).json({ message: 'Incomplete data' });
    }
});
content.get('/getPostInfo', async (req, res) => {
    const postID = req.headers.postid;
    if (postID) {
        let conn;
        try {
            conn = await pool.getConnection();
            let rows = await conn.query('SELECT postID, userID, title, description, quantity, price, availableFrom, availableTo, active FROM posts WHERE postID = ?;', [postID]);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Post not found' });
            } else {
                let images = await conn.query('SELECT fileName FROM postImageDetails WHERE postID = ?;', [postID]);
                let categories = await conn.query('SELECT categoryID id FROM postCategoryDetails WHERE postID = ?;', [postID]);
                rows[0].images = images.length === 0 ? [] : images.map(image => image.fileName);
                rows[0].categories = categories.length === 0 ? [] : categories.map(category => ({id: category.id }));
                return res.status(200).json(rows[0]);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
content.get('/getUserPosts', async (req, res) => {
    const userID = req.headers.userid;
    if (userID) {
        let conn;
        try {
            conn = await pool.getConnection();
            let rows = await conn.query('SELECT postID, title, description, quantity, price, availableFrom, availableTo, active FROM posts where userID = ?;', [userID]);
            for (let i = 0; i < rows.length; i++) {
                let images = await conn.query('SELECT fileName FROM postImageDetails WHERE postID = ?;', [rows[i].postID]);
                let categories = await conn.query('SELECT categoryID id FROM postCategoryDetails WHERE postID = ?;', [rows[i].postID]);
                rows[i].images = images.length === 0 ? [] : images.map(image => image.fileName);
                rows[i].categories = categories.length === 0 ? [] : categories.map(category => ({id: category.id }));
            }
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error: ' + error });
        } finally {
            if (conn) conn.end();
        }
    } else return res.status(400).json({ message: 'Incomplete data' });
});
export default content;