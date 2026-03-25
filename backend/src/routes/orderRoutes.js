import express from "express";
// 1. GỘP CHUNG TẤT CẢ VÀO ĐÂY (Không import 2 lần nữa)
import {
  addOrderItems,
  getMyOrders,
  updateOrderToDelivered,
  getAllOrders,
  updateOrderStatus,
  refundOrder,
} from "../controllers/orderController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 2. KHAI BÁO CÁC ĐƯỜNG DẪN (ROUTER)

// Tạo đơn hàng mới
router.post("/", protect, addOrderItems);

// Lấy danh sách lịch sử đơn hàng (Lưu ý: Phải đặt /myorders TRƯỚC /:id)
router.get("/myorders", protect, getMyOrders);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.put("/:id/refund", protect, admin, refundOrder);

export default router;