

// @desc    Get all jobs
// @route   GET api/v1/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "jobs"
    })
}