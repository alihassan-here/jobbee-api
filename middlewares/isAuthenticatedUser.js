const jwt = require('jsonwebtoken');
const User = require('../models/authModel');
const catchAsyncErrors = require('./catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

//CHECK IF THE USER IS AUTHENTICATED
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorHandler('You are not logged in! Please log in to access this resource', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new ErrorHandler('The user belonging to this token does not exist', 401));
    }
    req.user = currentUser;
    next();
}
);

//HANDLING USER ROLES
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler('You do not have permission to perform this action', 403));
        }
        next();
    }
}