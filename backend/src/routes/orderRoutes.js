import express from "express";
import {
  addOrderItems,
  getMyOrders,
  updateOrderToDelivered,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, addOrderItems);
router.get("/myorders", protect, getMyOrders);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

export default router;
