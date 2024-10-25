const express = require('express');
const upload = express.Router();
const multer = require('multer');
const path = require('path');
//File upload configs
const Poststorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, path.parse(file.originalname).name + '-' + Date.now() + '.webp')
    }
})
const Userstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'users/')
    },
    filename: function (req, file, cb) {
        cb(null, path.parse(file.originalname).name + '-' + Date.now() + '.webp')
    }
})
const uploadPostFile = multer({ storage : Poststorage });
const uploadUserFile = multer({ storage : Userstorage });
//Endpoints
upload.post('/postImage', uploadPostFile.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ code: 400, message: 'No file uploaded' });
    }
    res.status(201).json(req.file.filename);
});
upload.post('/userImage', uploadUserFile.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ code: 400, message: 'No file uploaded' });
    }
    res.status(201).json(req.file.filename);
});
module.exports = upload;