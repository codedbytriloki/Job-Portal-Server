import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getAdminJobs, getJobById, postJob, getAllJobs } from '../controllers/jobController.js';

const router = express.Router();

router.post('/post', isAuthenticated, postJob);
router.get('/getAdminJobs', isAuthenticated, getAdminJobs);
router.get('/get', getAllJobs); // public route - no authentication required for browsing jobs
router.get('/get/:id', getJobById); // public route - anyone can view job details

export default router;