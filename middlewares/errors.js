const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        });
    }
    if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        //WRONG MONGOOSE OBJECT ID ERROR
        if (err.name === "CastError") {
            const message = `Resource not found. Invalid ${err.path}`;
            error = new ErrorHandler(message, 404);
        }

        //HANDLING MONGOOSE VALIDATION ERRORS
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        }

        //HANDLING MONGOOSE DUPLICATE KEY ERROR
        if (err.code === 11000) {
            const message = `Duplicate field value entered. ${err.keyValue.name}`;
            error = new ErrorHandler(message, 400);
        }

        //HANDLING WRONG JWT TOKEN ERROR
        if (err.name === "JsonWebTokenError") {
            const message = "Invalid token. Please log in again";
            error = new ErrorHandler(message, 401);
        }

        //HANDLING EXPIRED JWT TOKEN ERROR
        if (err.name === "TokenExpiredError") {
            const message = "Token has expired. Please log in again";
            error = new ErrorHandler(message, 401);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || "Internal Server Error",
        });

    }
}