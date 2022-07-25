const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/authModel');


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

    res.status(200).json({
        success: true,
        message: "User Created.",
        data: user,
    });
}
);