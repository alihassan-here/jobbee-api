const express = require('express');
const {
    getAllJobs,
    getJob,
    newJob,
    getJobsWithinRadius,
    updateJob,
    deleteJob,
    jobStats,
    applyForJob
} = require('../controllers/jobControllers');
const {
    isAuthenticatedUser,
    authorizeRoles,
} = require('../middlewares/isAuthenticatedUser');

const router = express.Router();


router.route("/jobs").get(getAllJobs);
router.route("/job/:id/:slug").get(getJob);
router.route("/jobs/:zipcode/:distance").get(getJobsWithinRadius);
router.route("/stats/:topic").get(jobStats);

router.route("/job/new").post(isAuthenticatedUser, authorizeRoles("employeer", "admin"), newJob);

router.route("/job/:id")
    .put(isAuthenticatedUser, authorizeRoles("employeer", "admin"), updateJob)
    .delete(isAuthenticatedUser, authorizeRoles("employeer", "admin"), deleteJob);


router.route("/job/:id/apply").put(isAuthenticatedUser, authorizeRoles("employeer"), applyForJob);



module.exports = router;