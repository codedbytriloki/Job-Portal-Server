import express from 'express';
import { applyJob, getAppliedJob, updateStatus, getAppplicants } from '../controllers/applicationController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.get('/apply/:id', isAuthenticated, applyJob);
router.get('/get', isAuthenticated, getAppliedJob);
router.get('/:id/applicants', isAuthenticated, getAppplicants);
router.post('/status/:id/update', isAuthenticated, updateStatus);

export default router;