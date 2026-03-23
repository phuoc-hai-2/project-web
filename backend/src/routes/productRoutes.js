import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  addKeysToVault,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, admin, createProduct);
router.post("/:id/keys", protect, admin, addKeysToVault);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
