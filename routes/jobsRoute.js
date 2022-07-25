const express = require('express');
const {
    getAllJobs,
    getJob,
    newJob,
    getJobsWithinRadius,
    updateJob,
    deleteJob,
    jobStats,
} = require('../controllers/jobsControllers');
const { isAuthenticatedUser } = require('../middlewares/isAuthenticatedUser');

const router = express.Router();


router.route("/jobs").get(getAllJobs);
router.route("/job/:id/:slug").get(getJob);
router.route("/jobs/:zipcode/:distance").get(getJobsWithinRadius);
router.route("/stats/:topic").get(jobStats);

router.route("/job/new").post(isAuthenticatedUser, newJob);

router.route("/job/:id")
    .put(isAuthenticatedUser, updateJob)
    .delete(isAuthenticatedUser, deleteJob);




module.exports = router;