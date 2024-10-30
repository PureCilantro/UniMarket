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
content.get('/getPosts', async (req, res) => {
    
});
module.exports = content;