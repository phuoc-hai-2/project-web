import Review from "../models/Review.js";

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // 🔥 kiểm tra id hợp lệ
    if (!productId) {
      return res.status(400).json({
        message: "Thiếu productId",
      });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name") // lấy tên user
      .sort({ createdAt: -1 }); // mới nhất trước

    // 🎯 tính rating trung bình
    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0;

    res.status(200).json({
      count: reviews.length,
      avgRating: Number(avgRating.toFixed(1)),
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const createReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const imageUrls = req.files.map(
      (file) => `http://localhost:5000/uploads/${file.filename}`,
    );

    const review = await Review.create({
      userId: req.user._id,
      product: productId,
      rating,
      comment,
      images: imageUrls,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
