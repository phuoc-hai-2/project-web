import express from "express";
import {
  createPaymentUrl,
  vnpayReturn,
} from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create_payment_url", protect, createPaymentUrl);
router.get("/vnpay_return", vnpayReturn); // VNPay gọi callback, không cần token

export default router;
