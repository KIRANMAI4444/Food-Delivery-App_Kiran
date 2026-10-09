
import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

//POST /api/auth/register
router.post('/register', register);

//POST /api/auth/Login
router.post('/login', login)

//GET /api/auth/getMe
router.get('/me', protect, getMe); //<- Protected route

export default router;

