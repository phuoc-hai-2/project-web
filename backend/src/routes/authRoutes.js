import express from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  authLimiter,
  passwordResetLimiter,
} from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.put("/reset-password/:token", passwordResetLimiter, resetPassword);

export default router;
