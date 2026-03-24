import Product from "../models/Product.js";

// GET /api/categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// GET /api/category/:slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.slug });
    res
      .status(200)
      .json({ category: req.params.slug, count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
