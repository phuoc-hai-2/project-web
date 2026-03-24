import Product from "../models/Product.js";

export const getAllProductsService = async (keyword) => {
  const searchRule = keyword
    ? { name: { $regex: keyword, $options: "i" }, status: "Published" }
    : { status: "Published" };

  const products = await Product.find({ ...searchRule }).select(
    "-digitalVault",
  );

  return products;
};

export const getProductByIdService = async (id) => {
  const product = await Product.findById(id).select("-digitalVault");

  if (!product) throw new Error("Không tìm thấy sản phẩm này");
  return product;
};
