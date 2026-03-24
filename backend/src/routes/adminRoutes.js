import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  toggleBlockUser,
  getAnalytics,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protect, admin);

router.get("/dashboard", getDashboardStats);
router.get("/analytics", getAnalytics);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/block", toggleBlockUser);

export default router;
