import express from 'express';
import { login, logout, register, updateProfile } from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

router.post('/register', upload, register);
router.post('/login', login);
router.post('/profile/update', isAuthenticated, upload, updateProfile);
router.get('/logout', isAuthenticated, logout)

export default router;