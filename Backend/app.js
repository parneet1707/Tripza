const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
dotenv.config();
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.use('/users', userRoutes);


module.exports = app;