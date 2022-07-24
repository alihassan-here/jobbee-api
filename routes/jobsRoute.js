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

const router = express.Router();


router.route("/jobs").get(getAllJobs);
router.route("/job/:id/:slug").get(getJob);
router.route("/jobs/:zipcode/:distance").get(getJobsWithinRadius);
router.route("/stats/:topic").get(jobStats);

router.route("/job/new").post(newJob);

router.route("/job/:id")
    .put(updateJob)
    .delete(deleteJob);




module.exports = router;