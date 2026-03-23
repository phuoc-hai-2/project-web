import Product from "../models/Product.js";

// 📌 Lấy tất cả category (unique từ product)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// 📌 Lấy sản phẩm theo category (slug = string)
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // tìm sản phẩm theo category (string)
    const products = await Product.find({ category: slug });

    res.status(200).json({
      category: slug,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};
