import Order from "../models/Order.js";
import User from "../models/User.js";
import {
  sendOrderConfirmationEmail,
  sendKeyDeliveryEmail,
  sendRefundEmail,
} from "../services/emailService.js";

// POST /api/orders  [User]
export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, digitalDeliveryInfo, paymentMethod, totalPrice } =
      req.body;
    if (!orderItems || orderItems.length === 0)
      return res
        .status(400)
        .json({ message: "Không có sản phẩm nào trong đơn hàng" });

    const order = new Order({
      user: req.user._id,
      orderItems,
      digitalDeliveryInfo,
      paymentMethod,
      totalPrice,
    });
    const createdOrder = await order.save();
    await sendOrderConfirmationEmail(
      createdOrder,
      digitalDeliveryInfo.emailReceive,
    );
    res.status(201).json(createdOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi tạo đơn hàng", error: error.message });
  }
};

// GET /api/orders/myorders  [User]
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

// GET /api/orders/:id  [User/Admin]
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    )
      return res
        .status(403)
        .json({ message: "Không có quyền xem đơn hàng này" });
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy đơn hàng", error: error.message });
  }
};

// PUT /api/orders/:id/deliver  [Admin] - Hoàn thành dịch vụ thủ công
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    order.status = "Completed";
    order.completedAt = Date.now();
    order.orderItems.forEach((item) => {
      if (item.deliveredContent?.includes("Admin đang tiến hành"))
        item.deliveredContent =
          "Admin đã hoàn tất xử lý dịch vụ. Cảm ơn bạn đã tin tưởng!";
    });
    const updatedOrder = await order.save();

    const user = await User.findById(order.user);
    if (user)
      await sendKeyDeliveryEmail(
        updatedOrder,
        order.digitalDeliveryInfo.emailReceive || user.email,
      );
    res.json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi cập nhật trạng thái đơn hàng",
        error: error.message,
      });
  }
};

// GET /api/orders/admin  [Admin]
export const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const filter = req.query.status ? { status: req.query.status } : {};
    const count = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    res.json({ orders, page, pages: Math.ceil(count / limit), total: count });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách đơn hàng",
        error: error.message,
      });
  }
};

// PUT /api/orders/:id/status  [Admin]
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    order.status = req.body.status;
    if (req.body.status === "Completed") order.completedAt = Date.now();
    res.json(await order.save());
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật trạng thái", error: error.message });
  }
};

// PUT /api/orders/:id/refund  [Admin]
export const refundOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    if (!order.isPaid)
      return res.status(400).json({ message: "Đơn hàng chưa được thanh toán" });
    order.status = "Refunded";
    const updatedOrder = await order.save();
    const user = await User.findById(order.user);
    if (user)
      await sendRefundEmail(
        updatedOrder,
        order.digitalDeliveryInfo.emailReceive || user.email,
      );
    res.json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi hoàn tiền", error: error.message });
  }
};
