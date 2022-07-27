const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/userModel');
const createSendToken = require('../utils/createSendToken')

// @desc    - Get Current User
// @route   - GET /api/v1/me
// @access  - Private
exports.getMe = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
}
);

// @desc    - Update User Password
// @route   - PUT /api/v1/password/update
// @access  - Private
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.correctPassword(req.body.currentPassword, user.password);
    if (!isMatch) {
        return next(new ErrorHandler('Password is incorrect', 401));
    }
    user.password = req.body.newPassword;
    await user.save();

    createSendToken(user, 200, res)
}
);

// @desc    - Update User Data
// @route   - PUT /api/v1/me/update
// @access  - Private
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: {
            user
        }
    });
}
);

// @desc    - Delete User
// @route   - DELETE /api/v1/me/delete
// @access  - Private
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    await User.findByIdAndDelete(req.user.id);

    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: 'Your account has been deleted'
    });
}
);