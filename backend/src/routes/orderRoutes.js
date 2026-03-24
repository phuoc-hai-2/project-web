import express from "express";
// 1. GỘP CHUNG TẤT CẢ VÀO ĐÂY (Không import 2 lần nữa)
import {
  addOrderItems,
  getMyOrders,
  getOrderById, 
  updateOrderToDelivered,
} from "../controllers/orderController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 2. KHAI BÁO CÁC ĐƯỜNG DẪN (ROUTER)

// Tạo đơn hàng mới
router.post("/", protect, addOrderItems);

// Lấy danh sách lịch sử đơn hàng (Lưu ý: Phải đặt /myorders TRƯỚC /:id)
router.get("/myorders", protect, getMyOrders);

// Lấy chi tiết đơn hàng để hiện Két Sắt / Key (Đã thêm vào đây)
router.get("/:id", protect, getOrderById);

// Admin xác nhận đã giao hàng
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

export default router;