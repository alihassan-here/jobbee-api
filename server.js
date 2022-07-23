const express = require('express');
require('colors');
const connectDatabase = require('./config/database');

//SETTING UP CONFIG.ENV FILE VARIABLES
require('dotenv').config({
    path: "./config/config.env"
});

//CONNECTING TO DATABASE
connectDatabase();


//IMPORTING ALL ROUTES
const jobsRoutes = require('./routes/jobsRoute');


const app = express();





app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
app.use("/api/v1/jobs", jobsRoutes);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`.rainbow);
})