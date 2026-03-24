import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, o) => acc + o.totalPrice, 0);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = await Order.aggregate([
      { $match: { isPaid: true, paidAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" } },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, role: "user" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const topProducts = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          totalSold: { $sum: "$orderItems.qty" },
          totalRevenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      revenueByMonth,
      userGrowth,
      topProducts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thống kê", error: error.message });
  }
};

// GET /api/admin/analytics
export const getAnalytics = async (req, res) => {
  try {
    const mostOrdered = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          orderCount: { $sum: 1 },
          totalQty: { $sum: "$orderItems.qty" },
        },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 10 },
    ]);

    const totalCreated = await Order.countDocuments();
    const totalPaid = await Order.countDocuments({ isPaid: true });
    const totalCompleted = await Order.countDocuments({ status: "Completed" });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrdersStats = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: { $cond: ["$isPaid", "$totalPrice", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      mostOrdered,
      funnel: {
        created: totalCreated,
        paid: totalPaid,
        completed: totalCompleted,
      },
      recentOrdersStats,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy analytics", error: error.message });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const keyword = req.query.keyword;
    const filter = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};
    const count = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    res.json({ users, page, pages: Math.ceil(count / limit), total: count });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách người dùng",
        error: error.message,
      });
  }
};

// GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ user, orders });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy thông tin người dùng",
        error: error.message,
      });
  }
};

// PUT /api/admin/users/:id/block
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    if (user.role === "admin")
      return res
        .status(400)
        .json({ message: "Không thể khóa tài khoản admin" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({
      message: user.isBlocked ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi cập nhật trạng thái tài khoản",
        error: error.message,
      });
  }
};
