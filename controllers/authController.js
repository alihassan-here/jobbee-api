const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/authModel');
const createSendToken = require('../utils/createSendToken');


// @desc    Register a new user
// @route   POST api/v1/users/register
// @access  Public
exports.register = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    createSendToken(user, 201, res);
}
);

// @desc    Login a user
// @route   POST api/v1/login
// @access  Public
exports.login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Check if email and password are present
    if (!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
    }

    // 2. Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new ErrorHandler('Incorrect email or password', 401));
    }

    // 3. If everything is ok, send token to client
    createSendToken(user, 200, res);
}
);