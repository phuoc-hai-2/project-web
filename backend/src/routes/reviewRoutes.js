import express from "express";
import {
  createReview,
  getReviewsByProduct,
  getAllReviews,
  updateReviewStatus,
  replyToReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.array("images", 5), createReview);
router.get("/product/:productId", getReviewsByProduct);
router.get("/admin", protect, admin, getAllReviews);
router.put("/:id/status", protect, admin, updateReviewStatus);
router.put("/:id/reply", protect, admin, replyToReview);
router.delete("/:id", protect, admin, deleteReview);

export default router;
