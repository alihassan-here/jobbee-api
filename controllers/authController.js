const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/authModel');
const createSendToken = require('../utils/createSendToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


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

// @desc    FORGOT PASSWORD
// @route   POST api/v1/password/forgot
// @access  Public
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    // 1. Check if email is present
    if (!email) {
        return next(new ErrorHandler('Please provide email', 400));
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler('No user found with this email', 404));
    }

    // 3. If everything is ok, get reset token
    const resetToken = user.generateResetPasswordToken();
    // 4. Save the reset token to user's model
    await user.save({ validateBeforeSave: false });

    // 5. Send the email with reset token
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message: `Your password reset token is here: ${resetURL}`
        });

        res.status(200).json({
            status: 'success',
            message: `Email sent successfully to ${user.email}, please check your email.`
        });
    } catch (err) {
        //IF EMAIL FAILS, DELETE RESET TOKEN
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler('Email could not be sent', 500));
    }

}
);

// @desc    RESET PASSWORD
// @route   PUT api/v1/password/reset/:resetToken
// @access  Public
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //Hash url token
    const resetToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');
    const { password } = req.body;

    // 1. Check if reset token is present
    if (!resetToken) {
        return next(new ErrorHandler('Please provide reset token', 400));
    }

    // 2. Check if password is present
    if (!password) {
        return next(new ErrorHandler('Please provide password', 400));
    }

    // 3. Check if reset token is valid
    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Invalid token or token has been expired', 400));
    }

    // 4. If everything is ok, update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // 5. Send the email with reset token
    createSendToken(user, 200, res);
}
);

// @desc    LOGOUT USER
// @route   GET api/v1/logout
// @access  Private
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        status: true,
        message: 'Successfully logged out'
    });
}
);

