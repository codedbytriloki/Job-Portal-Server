import express from 'express';
import { getCompany, getCompanyById, registerCompany, updateCompany } from '../controllers/companyController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

router.post('/register', isAuthenticated, registerCompany);
router.get('/get', isAuthenticated, getCompany);
router.get('/get/:id', isAuthenticated, getCompanyById);
router.put('/update/:id', isAuthenticated, upload, updateCompany);

export default router;