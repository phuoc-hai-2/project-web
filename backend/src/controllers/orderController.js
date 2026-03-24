import Order from "../models/Order.js";
import User from "../models/User.js";
import { sendOrderConfirmationEmail, sendKeyDeliveryEmail, sendRefundEmail } from "../services/emailService.js";

export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, digitalDeliveryInfo, paymentMethod, totalPrice } =
      req.body;

    if (orderItems && orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm nào trong đơn hàng" });
    } else {
      const order = new Order({
        user: req.user._id,
        orderItems,
        digitalDeliveryInfo,
        paymentMethod,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Send confirmation email
      await sendOrderConfirmationEmail(createdOrder, digitalDeliveryInfo.emailReceive);

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi tạo đơn hàng", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi hệ thống khi lấy lịch sử đơn hàng",
        error: error.message,
      });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    // Users can only see their own orders
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền xem đơn hàng này" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng", error: error.message });
  }
};

export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = "Completed";
      order.completedAt = Date.now();

      order.orderItems.forEach((item) => {
        if (
          item.deliveredContent &&
          item.deliveredContent.includes("Admin đang tiến hành")
        ) {
          item.deliveredContent =
            "Admin đã hoàn tất xử lý dịch vụ cho tài khoản của bạn. Cảm ơn bạn đã tin tưởng!";
        }
      });

      const updatedOrder = await order.save();

      // Send key delivery email
      const user = await User.findById(order.user);
      if (user) {
        await sendKeyDeliveryEmail(updatedOrder, order.digitalDeliveryInfo.emailReceive || user.email);
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi cập nhật trạng thái đơn hàng",
        error: error.message,
      });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const status = req.query.status;

    const filter = status ? { status } : {};
    const count = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.json({ orders, page, pages: Math.ceil(count / limit), total: count });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error: error.message });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    order.status = status;
    if (status === "Completed") {
      order.completedAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: error.message });
  }
};

// Admin: Refund order
export const refundOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (!order.isPaid) {
      return res.status(400).json({ message: "Đơn hàng chưa được thanh toán" });
    }

    order.status = "Refunded";
    const updatedOrder = await order.save();

    // Send refund email
    const user = await User.findById(order.user);
    if (user) {
      await sendRefundEmail(updatedOrder, order.digitalDeliveryInfo.emailReceive || user.email);
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi hoàn tiền", error: error.message });
  }
};
