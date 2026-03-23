import Product from "../models/Product.js";

export const getAllProductsService = async (keyword) => {
  const searchRule = keyword
    ? { name: { $regex: keyword, $options: "i" } }
    : {};

  // BÍ QUYẾT Ở ĐÂY: Thêm .select('-digitalVault')
  // Dấu trừ (-) báo cho MongoDB biết là lấy mọi thứ NGOẠI TRỪ trường digitalVault
  const products = await Product.find({ ...searchRule }).select(
    "-digitalVault",
  );

  return products;
};

export const getProductByIdService = async (id) => {
  // Tương tự, che digitalVault khi xem chi tiết 1 sản phẩm
  const product = await Product.findById(id).select("-digitalVault");

  if (!product) throw new Error("Không tìm thấy sản phẩm này");
  return product;
};
