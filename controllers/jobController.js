import { Job } from '../models/job_model.js';
// admin port job
export const postJob = async (req, res) => {
  try {
    // log the incoming payload so we can inspect it when running in production
    console.log('postJob body:', req.body);

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId
    } = req.body;
    const userId = req.id;

    // basic presence validation
    if (
      !title ||
      !description ||
      !requirements ||
      salary === undefined ||
      !location ||
      !jobType ||
      experience === undefined ||
      position === undefined ||
      !companyId
    ) {
      return res.status(400).json({
        message: 'Please provide all required fields',
        success: false
      });
    }

    // coerce numeric values and validate
    const salaryNum = Number(salary);
    const experienceNum = Number(experience);
    const positionNum = Number(position);
    if (isNaN(salaryNum) || isNaN(experienceNum) || isNaN(positionNum)) {
      return res.status(400).json({
        message: 'Salary, experience and position must be valid numbers',
        success: false
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(',').map(r => r.trim()).filter(Boolean),
      salary: salaryNum,
      location,
      jobType,
      experience: experienceNum,
      position: positionNum,
      company: companyId,
      created_by: userId,
    });

    return res.status(200).json({
      message: 'New Job Created Successfully',
      job,
      success: true
    });
  } catch (err) {
    console.error('postJob error', err);

    // return mongoose validation errors with 400 so front end can handle them
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: err.message,
        success: false,
        errors: err.errors
      });
    }

    return res.status(500).json({
      message: 'Server error',
      success: false,
      err: err.message || err
    });
  }
}

// student
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = keyword ? {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    } : {};
    const jobs = await Job.find(query).populate({ path: "company" }).sort({ createdAt: -1 });

    // always return array (empty if no matches)
    return res.status(200).json({
      jobs,
      success: true
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
      success: false,
      err
    });
  }
}
// student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({ path: "applications" });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    };
    return res.status(200).json({
      job,
      success: true
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
      success: false,
      err
    });
  }
}

//admin by created job 
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({ path: 'company' })
    if (!jobs) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    };
    return res.status(200).json({
      jobs,
      success: true
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
      success: false,
      err
    });
  }
}
