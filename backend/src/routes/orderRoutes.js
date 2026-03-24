import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  getAllOrders,
  updateOrderStatus,
  refundOrder,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, addOrderItems);
router.get("/myorders", protect, getMyOrders);
router.get("/admin", protect, admin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.put("/:id/refund", protect, admin, refundOrder);

export default router;
