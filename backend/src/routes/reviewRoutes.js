import express from "express";
import {
  createReview,
  getReviewsByProduct,
} from "../controllers/reviewController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.array("images", 5), createReview);
router.get("/product/:productId", getReviewsByProduct);
export default router;
