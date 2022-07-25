const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'employeer', 'admin'],
            message: 'Please select correct role'
        },
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date

});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    // Only run this function if password was moddified (not on other update functions)
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
}
);

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// Match user entered password to hashed password in database
userSchema.methods.correctPassword = async function (enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
}

module.exports = mongoose.model('User', userSchema);