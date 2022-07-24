const Job = require('../models/jobsModel');
const geoCoder = require('../utils/geocoder');

// @desc    Get all jobs
// @route   GET api/v1/jobs
// @access  Public
exports.getAllJobs = async (req, res, next) => {
    const jobs = await Job.find();
    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    })
}
// @desc    Get single job
// @route   GET api/v1/job/:id/:slug
// @access  Public
exports.getJob = async (req, res, next) => {
    const job = await Job.find({ $and: [{ _id: req.params.id }, { slug: req.params.slug }] });

    if (!job || job.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Job Not Found",
        });
    }

    res.status(200).json({
        success: true,
        data: job,
    });
}

// @desc    create new job
// @route   POST api/v1/job
// @access  Private
exports.newJob = async (req, res, next) => {
    const job = await Job.create(req.body);

    res.status(200).json({
        success: true,
        message: "Job Created.",
        data: job,
    });
}

// @desc    Update a job
// @route   PUT api/v1/job/:id
// @access  Private
exports.updateJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false,
            message: "Job Not Found",
        });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });


    res.status(200).json({
        success: true,
        message: "Job is Updated.",
        data: job,
    });
}

// @desc    Delete a job
// @route   DELETE api/v1/job/:id
// @access  Private
exports.deleteJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false,
            message: "Job Not Found",
        });
    }

    job = await Job.findByIdAndDelete(req.params.id);


    res.status(200).json({
        success: true,
        message: "Job is Deleted.",
    });
}

// @desc    Search job within radius
// @route   POST api/v1/jobs/:zipcode/:distance
// @access  Public
exports.getJobsWithinRadius = async (req, res, next) => {
    const { zipcode, distance } = req.params;


    //get latitude & langitude from geocoder
    const loc = await geoCoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;


    //calc radius using radians
    //divide dist by radius of earth
    //Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
    const jobs = await Job.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    });

}

// @desc    Get stats about a job
// @route   POST api/v1/stats/:topic
// @access  Public

exports.jobStats = async (req, res, next) => {
    const stats = await Job.aggregate([
        {
            $match: { $text: { $search: "\"" + req.params.topic + "\"" } }
        },
        {
            $group: {
                _id: { $toUpper: "$experience" },
                totalJobs: { $sum: 1 },
                avgPosition: { $avg: "$positions" },
                avgSalary: { $avg: "$salary" },
                minSalary: { $min: "$salary" },
                maxSalary: { $max: "$salary" }
            }
        }
    ]);
    if (stats.length === 0) {
        return res.status(200).json({
            success: false,
            message: `No stats found for - ${req.params.topic}`
        })
    }

    res.status(200).json({
        success: true,
        data: stats
    })
}