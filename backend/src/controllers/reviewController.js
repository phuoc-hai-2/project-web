import Review from "../models/Review.js";

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        message: "Thiếu productId",
      });
    }

    const reviews = await Review.find({ product: productId, status: { $ne: "hidden" } })
      .populate("user", "name")
      .sort({ createdAt: -1 });

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

    const imageUrls = req.files
      ? req.files.map((file) => `http://localhost:5000/uploads/${file.filename}`)
      : [];

    const review = await Review.create({
      user: req.user._id,
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

// Admin: Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const status = req.query.status;

    const filter = status ? { status } : {};
    const count = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({ reviews, page, pages: Math.ceil(count / limit), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update review status (approve/hide)
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy review" });
    }

    review.status = status;
    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Reply to review
export const replyToReview = async (req, res) => {
  try {
    const { adminReply } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy review" });
    }

    review.adminReply = adminReply;
    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy review" });
    }
    await Review.deleteOne({ _id: review._id });
    res.json({ message: "Đã xóa review thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
