const express = require('express');
const colors = require('colors');
const connectDatabase = require('./config/database');
const errorMiddleware = require("./middlewares/errors");
const ErrorHandler = require('./utils/errorHandler');

//SETTING UP CONFIG.ENV FILE VARIABLES
require('dotenv').config({
    path: "./config/config.env"
});

//HANDLING UNCAUGHT EXCEPTIONS
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception..`);
    process.exit(1);
})

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
const authRoutes = require('./routes/authRoute');
app.use("/api/v1", jobsRoutes);
app.use("/api/v1", authRoutes);

//THIS SHOULD BE BELOW ALL ROUTES
//HANDLE  UNHANDLED ROUTES
app.all("*", (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404))
});

//ERROR HANDLER MIDDLEWARE
app.use(errorMiddleware);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`.yellow);
});

//HANDLING UNHANDLED PROMISE REJECTION
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled promise rejection.`);
    server.close(() => {
        process.exit(1);
    });
})