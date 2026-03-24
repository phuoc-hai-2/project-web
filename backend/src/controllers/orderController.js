import Order from "../models/Order.js";

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
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      // Kiểm tra bảo mật: Chỉ Admin hoặc đúng chủ nhân đơn hàng mới được xem
      if (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString()) {
        res.json(order);
      } else {
        res.status(403).json({ message: "Bạn không có quyền xem đơn hàng này" });
      }
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết đơn hàng" });
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
