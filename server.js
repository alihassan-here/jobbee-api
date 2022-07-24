const express = require('express');
const colors = require('colors');
const connectDatabase = require('./config/database');

//SETTING UP CONFIG.ENV FILE VARIABLES
require('dotenv').config({
    path: "./config/config.env"
});

//CONNECTING TO DATABASE
connectDatabase();

const app = express();

//MIDDLEWARES
app.use(express.json());
app.use((req, res, next) => {
    console.log(colors.bgWhite.black(req.path), colors.bgWhite.black(req.method));
    next();
});

//IMPORTING ALL ROUTES
const jobsRoutes = require('./routes/jobsRoute');
app.use("/api/v1", jobsRoutes);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`.yellow);
})