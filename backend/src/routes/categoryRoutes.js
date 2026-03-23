import express from "express";
import {
  getAllCategories,
  getCategoryBySlug,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/categories", getAllCategories);
router.get("/category/:slug", getCategoryBySlug);

export default router;
