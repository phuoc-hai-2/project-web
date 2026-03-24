import Product from "../models/Product.js";
import {
  getAllProductsService,
  getProductByIdService,
} from "../services/productService.js";

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await getAllProductsService(req.query.keyword);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách sản phẩm" });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// POST /api/products  [Admin]
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      description,
      category,
      productType,
      status,
      tags,
      seoTitle,
      seoDescription,
    } = req.body;
    const product = new Product({
      name,
      price,
      image,
      category,
      description,
      productType: productType || "Key",
      status: status || "Published",
      tags: tags || [],
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
      digitalVault: [],
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo sản phẩm mới", error: error.message });
  }
};

// POST /api/products/:id/keys  [Admin] - Nạp key vào kho
export const addKeysToVault = async (req, res) => {
  try {
    const { keys } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    if (product.productType !== "Key")
      return res
        .status(400)
        .json({ message: "Sản phẩm này là Dịch vụ, không cần nhập Key" });

    product.digitalVault.push(
      ...keys.map((k) => ({ content: k, isSold: false })),
    );
    await product.save();
    res.status(201).json({
      message: `Đã nạp thành công ${keys.length} mã Key vào kho!`,
      totalInStock: product.digitalVault.filter((k) => !k.isSold).length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi nhập kho Key", error: error.message });
  }
};

// PUT /api/products/:id  [Admin]
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      description,
      category,
      productType,
      status,
      tags,
      seoTitle,
      seoDescription,
    } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.description = description || product.description;
    product.category = category || product.category;
    product.productType = productType || product.productType;
    if (status !== undefined) product.status = status;
    if (tags !== undefined) product.tags = tags;
    if (seoTitle !== undefined) product.seoTitle = seoTitle;
    if (seoDescription !== undefined) product.seoDescription = seoDescription;

    res.json(await product.save());
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
  }
};

// DELETE /api/products/:id  [Admin]
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
  }
};
