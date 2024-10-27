//Dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
//Middleware
const notFound = require('./middleware/notFound');
//Routes
const upload = require('./routes/upload');
const user = require('./routes/user');
//Config
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
//Routes
app.use('/upload', upload);
app.use('/user', user);
app.use(notFound);
//Server status
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
})