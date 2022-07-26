const express = require('express');
const router = express.Router();
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    logout,
} = require('../controllers/authController');
const {
    isAuthenticatedUser,
} = require('../middlewares/isAuthenticatedUser');


router.route('/register').post(register);
router.route('/login').post(login);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:resetToken').put(resetPassword);

router.route('/logout').get(isAuthenticatedUser, logout);


module.exports = router;


