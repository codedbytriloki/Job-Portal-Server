import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getAdminJobs, getJobById, postJob, getAllJobs } from '../controllers/jobController.js';

const router = express.Router();

router.post('/post', isAuthenticated, postJob);
router.get('/getAdminJobs', isAuthenticated, getAdminJobs);
router.get('/get', isAuthenticated, getAllJobs);
router.get('/get/:id', isAuthenticated, getJobById);

export default router;