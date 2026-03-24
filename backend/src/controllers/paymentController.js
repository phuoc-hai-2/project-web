import { buildPaymentUrl } from "../services/vnpayService.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// POST /api/payments/create_payment_url  [User]
export const createPaymentUrl = (req, res) => {
  try {
    const { amount, orderInfo, orderId } = req.body;
    if (!amount || !orderInfo || !orderId)
      return res
        .status(400)
        .json({ message: "Thiếu thông tin tạo thanh toán" });
    const paymentUrl = buildPaymentUrl(req, amount, orderInfo, orderId);
    res.status(200).json({ url: paymentUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo URL thanh toán", error: error.message });
  }
};

// GET /api/payments/vnpay_return  [VNPay callback]
export const vnpayReturn = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const rspCode = vnp_Params["vnp_ResponseCode"];
    const orderId = vnp_Params["vnp_TxnRef"];
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    if (rspCode === "00") {
      const order = await Order.findById(orderId);
      if (!order)
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      if (order.isPaid)
        return res.redirect(
          `${frontendUrl}/payment/vnpay-return?success=true&orderId=${order._id}`,
        );

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: vnp_Params["vnp_TransactionNo"],
        status: rspCode,
        update_time: Date.now().toString(),
      };

      let allDelivered = true;
      for (let item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product?.productType === "Key") {
          const availableKeys = product.digitalVault.filter((k) => !k.isSold);
          if (availableKeys.length >= item.qty) {
            const deliveredKeys = [];
            for (let i = 0; i < item.qty; i++) {
              availableKeys[i].isSold = true;
              availableKeys[i].soldAt = Date.now();
              deliveredKeys.push(availableKeys[i].content);
            }
            item.deliveredContent = deliveredKeys.join(" | ");
          } else {
            item.deliveredContent =
              "Kho tạm hết Key, Admin sẽ gửi thủ công sớm nhất!";
            allDelivered = false;
          }
          await product.save();
        } else if (product?.productType === "Service") {
          item.deliveredContent =
            "Hệ thống đã ghi nhận. Admin đang tiến hành nâng cấp tài khoản!";
          allDelivered = false;
        }
      }

      order.status = allDelivered ? "Completed" : "Processing";
      if (allDelivered) order.completedAt = Date.now();
      await order.save();

      // Gửi email key delivery
      const User = (await import("../models/User.js")).default;
      const { sendKeyDeliveryEmail } =
        await import("../services/emailService.js");
      const user = await User.findById(order.user);
      if (user)
        await sendKeyDeliveryEmail(
          order,
          order.digitalDeliveryInfo.emailReceive || user.email,
        );

      res.redirect(
        `${frontendUrl}/payment/vnpay-return?success=true&orderId=${order._id}`,
      );
    } else {
      res.redirect(`${frontendUrl}/payment/vnpay-return?success=false`);
    }
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(
      `${frontendUrl}/payment/vnpay-return?success=false&error=${encodeURIComponent(error.message)}`,
    );
  }
};
