import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    // 1. Người mua
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    
    // 2. Danh sách sản phẩm số khách mua
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        // MỚI: Nơi lưu trữ tài sản số trả về cho khách
        // (Ví dụ: Chứa "XXXX-YYYY-ZZZZ" nếu là Key Win, hoặc "Tài khoản: abc, Pass: 123" nếu là Netflix)
        deliveredContent: { type: String }, 
      },
    ],

    // 3. MỚI: Thông tin nhận hàng (Thay thế cho shippingAddress)
    digitalDeliveryInfo: {
      emailReceive: { type: String, required: true }, // Email để hệ thống gửi Key tới
      accountToUpgrade: { type: String }, // Tài khoản cần nâng cấp (Dành cho Youtube Pre, Spotify...)
      note: { type: String } // Ghi chú thêm của khách
    },

    // 4. Thanh toán
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    
    // 5. Tổng tiền (Đã bỏ shippingPrice)
    totalPrice: { type: Number, required: true, default: 0.0 },

    // 6. Trạng thái thanh toán
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },

    // 7. MỚI: Trạng thái đơn hàng số (Thay cho isDelivered)
    status: { 
      type: String, 
      required: true, 
      enum: ['Pending', 'Processing', 'Completed', 'Cancelled', 'Refunded'],
      default: 'Pending' 
    },
    completedAt: { type: Date }, // Thời điểm hoàn tất giao Key/Nâng cấp
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;