const express = require('express');
const router = express.Router();
const {
    getMe,
    updatePassword,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const {
    isAuthenticatedUser,
    authorizeRoles,
} = require('../middlewares/isAuthenticatedUser');


router.route("/me").get(isAuthenticatedUser, getMe);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateUser);
router.route("/me/delete").delete(isAuthenticatedUser, deleteUser);

module.exports = router;