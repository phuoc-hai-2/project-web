import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Admin: Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = await Order.aggregate([
      { $match: { isPaid: true, paidAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$paidAt" },
            month: { $month: "$paidAt" },
          },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // User growth by month (last 6 months)
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

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          totalSold: { $sum: "$orderItems.qty" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } },
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
    res.status(500).json({ message: "Lỗi khi lấy thống kê", error: error.message });
  }
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const keyword = req.query.keyword;

    const filter = keyword
      ? { $or: [{ name: { $regex: keyword, $options: "i" } }, { email: { $regex: keyword, $options: "i" } }] }
      : {};

    const count = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.json({ users, page, pages: Math.ceil(count / limit), total: count });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error: error.message });
  }
};

// Admin: Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Get user's order history
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

    res.json({ user, orders });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng", error: error.message });
  }
};

// Admin: Block/unblock user
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Không thể khóa tài khoản admin" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái tài khoản", error: error.message });
  }
};

// Admin: Analytics - product views, funnel
export const getAnalytics = async (req, res) => {
  try {
    // Most viewed products (based on order frequency as proxy)
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

    // Funnel: Total orders created vs paid vs completed
    const totalCreated = await Order.countDocuments();
    const totalPaid = await Order.countDocuments({ isPaid: true });
    const totalCompleted = await Order.countDocuments({ status: "Completed" });

    // Recent orders stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrdersStats = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: {
            $sum: { $cond: ["$isPaid", "$totalPrice", 0] },
          },
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
    res.status(500).json({ message: "Lỗi khi lấy analytics", error: error.message });
  }
};
