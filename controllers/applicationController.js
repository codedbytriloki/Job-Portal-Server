import { Application } from "../models/application_model.js";
import { Job } from "../models/job_model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "job id is required",
        success: false
      });
    };
    // check user has already applied for the job
    const exisitioningApplication = await Application.findOne({ job: jobId, applieant: userId });

    if (exisitioningApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false
      })
    }
    // job not exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      })
    }
    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applieant: userId
    });
    job.applications.push(newApplication._id);
    await job.save();
    return res.status(201).json({
      message: "Job applied successfully",
      success: true,
      newApplication
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
      success: false,
      err
    });
  }
}

export const getAppliedJob = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applieant: userId }).sort({ createdAt: -1 }).populate({
      path: "job", options: { sort: { createdAt: - 1 } },
      populate: {
        path: "company",
        options: { sort: { createdAt: - 1 } }
      }
    }); //nested populate
    if (!application) {
      return res.status(404).json({
        message: "No Application",
        success: false
      });
    }

    return res.status(201).json({
      application,
      success: true
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
      success: false,
      err
    });
  }
}

// apply total user base on job
export const getAppplicants = async (req, res) => {
  try {
    // job id 
    const { id } = req.params;
    const job = await Job.findById(id).populate({
      path: "applications",
      options: { sort: { createdAt: - 1 } },
      populate: {
        path: "applieant",
        options: { sort: { createdAt: - 1 } }
      }
    })
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      })
    }
    return res.status(201).json({
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

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false
      })
    };

    // find the application base on applieant id
    const application = await Application.findById({ _id: applicationId });
    if (!application) {
      return res.status(400).json({
        message: "Application not found",
        success: false
      })
    };
    // update status
    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).json({
      message: "Status updated successfully",
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