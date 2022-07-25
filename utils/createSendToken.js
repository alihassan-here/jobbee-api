//CREATE AND SEND JWT TOKEN IN COOKIES
const jwt = require('jsonwebtoken');


const createSendToken = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    //Options for cookie
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    res.status(statusCode).cookie('token', token, cookieOptions).json({
        status: 'success',
        token
    });
}


module.exports = createSendToken;

