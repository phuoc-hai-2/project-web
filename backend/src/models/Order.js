import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        deliveredContent: { type: String }, // Key hoặc thông tin tài khoản giao cho khách
      },
    ],
    digitalDeliveryInfo: {
      emailReceive: { type: String, required: true },
      accountToUpgrade: { type: String },
      note: { type: String },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Completed", "Cancelled", "Refunded"],
      default: "Pending",
    },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
