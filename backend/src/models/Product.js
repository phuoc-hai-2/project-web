import mongoose from "mongoose";

// 1. Tạo một cấu trúc con để quản lý từng mã Key trong kho
const keySchema = mongoose.Schema({
  content: { type: String, required: true }, // Nội dung Key (VD: "ABCD-1234-WXYZ" hoặc "user:pass")
  isSold: { type: Boolean, default: false, required: true }, // Đánh dấu đã bán chưa
  soldAt: { type: Date }, // Thời điểm bán ra
});

// 2. Cấu trúc chính của Sản phẩm
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true }, // Link ảnh sản phẩm (Logo Windows, Youtube...)
    description: { type: String, required: true },
    category: { type: String, required: true }, // VD: 'Hệ điều hành', 'Giải trí', 'Bản quyền phần mềm'
    price: { type: Number, required: true, default: 0 },

    // MỚI 1: Phân loại sản phẩm số
    productType: {
      type: String,
      required: true,
      enum: ["Key", "Service"], // 'Key': Giao mã tự động | 'Service': Nâng cấp thủ công/API
      default: "Key",
    },

    // MỚI 2: KHO CHỨA BÍ MẬT (Digital Vault) - Chứa mảng các mã Key
    // CỰC KỲ QUAN TRỌNG: Dữ liệu này tuyệt đối không được gửi thẳng ra API cho khách xem
    digitalVault: [keySchema],

    // Trạng thái sản phẩm
    status: {
      type: String,
      enum: ["Draft", "Published", "Hidden"],
      default: "Published",
    },

    // Tags
    tags: [{ type: String }],

    // SEO
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  {
    timestamps: true,
  },
);

// MỚI 3: Tạo một trường "ảo" (virtual) tên là countInStock
// Trường này không lưu trong Database, mà nó tự tính toán dựa trên số Key chưa bán
productSchema.virtual("availableKeys").get(function () {
  return (this.digitalVault || []).filter((key) => !key.isSold).length;
});

// Đảm bảo các trường ảo (virtuals) được hiển thị khi xuất ra JSON gửi cho Frontend
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
