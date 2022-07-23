const express = require('express');
const { getJobs } = require('../controllers/jobsControllers');

const router = express.Router();


router.route("/").get(getJobs);




module.exports = router;