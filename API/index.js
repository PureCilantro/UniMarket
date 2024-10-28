//Dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
//Middleware
const notFound = require('./middleware/notFound');
const auth = require('./middleware/auth');
//Routes
const login = require('./routes/login');
const user = require('./routes/user');
const upload = require('./routes/upload');
//Config
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
//Routes
app.use('/login', login);
app.use(auth);
app.use('/user', user);
app.use('/upload', upload);
app.use(notFound);
//Server status
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
})