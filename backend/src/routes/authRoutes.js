import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';

const router = express.Router();

// Đường dẫn: /api/auth/register
router.post('/register', registerUser);

// Đường dẫn: /api/auth/login
router.post('/login', loginUser);

// QUAN TRỌNG: Phải có dòng này để app.js import được
export default router;