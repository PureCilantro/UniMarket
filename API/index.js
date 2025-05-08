//Dependencies
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
//Routes
import login from './routes/login.js';




//Middleware
import auth from './middleware/auth.js';
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Endpoints
app.use('/login', login);




app.use((req, res, next) => {
    res.status(404).send({ message: 'Not found' });
});

app.listen(process.env.PORT || 3200, () => {
    console.log('Server is running...');
})