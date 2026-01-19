const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
dotenv.config();
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.use('/users', userRoutes);
app.use('/captains', captainRoutes);


module.exports = app;