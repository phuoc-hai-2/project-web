import mongoose from "mongoose";

const keySchema = mongoose.Schema({
  content: { type: String, required: true },
  isSold: { type: Boolean, default: false, required: true },
  soldAt: { type: Date },
});

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0, min: 0 },
    productType: {
      type: String,
      required: true,
      enum: ["Key", "Service"],
      default: "Key",
    },
    digitalVault: [keySchema], // Kho key - KHÔNG gửi ra API public
    status: {
      type: String,
      enum: ["Draft", "Published", "Hidden"],
      default: "Published",
    },
    tags: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true },
);

// Virtual: đếm số key còn trong kho
productSchema.virtual("availableKeys").get(function () {
  return (this.digitalVault || []).filter((key) => !key.isSold).length;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("Product", productSchema);
