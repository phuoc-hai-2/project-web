import { useEffect, useState } from "react";
import api from "../api/axios";
import RatingStats from "./RatingStats";
function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  // 📌 Load review
  const fetchReviews = () => {
    api
      .get(`/reviews/product/${productId}`)
      .then((res) => res.data)
      .then((data) => {
        setReviews(data.reviews);
        setAvg(data.avgRating);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // 📌 Submit review
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("productId", productId);

    images.forEach((img) => {
      formData.append("images", img);
    });

    await api.post("/reviews", formData);

    setComment("");
    setImages([]);
    fetchReviews();
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>⭐ Đánh giá ({avg})</h2>

      {/* ⭐ UI chọn sao */}
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{
              cursor: "pointer",
              color: star <= rating ? "gold" : "gray",
              fontSize: "24px",
            }}
          >
            ★
          </span>
        ))}
      </div>

      {/* 💬 Comment */}
      <textarea
        placeholder="Nhập đánh giá..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* 📸 Upload ảnh */}
      <input
        type="file"
        multiple
        onChange={(e) => setImages([...e.target.files])}
      />

      {/* 👀 Preview ảnh */}
      <div>
        {images.map((img, i) => (
          <img key={i} src={URL.createObjectURL(img)} width="80" />
        ))}
      </div>

      <button onClick={handleSubmit}>Gửi đánh giá</button>

      <hr />

      {/* 📊 Biểu đồ rating */}
      <RatingStats reviews={reviews} />

      {/* 💬 Danh sách review */}
      {reviews.map((r) => (
        <div key={r._id} style={{ marginBottom: "20px" }}>
          <strong>{r.user?.name}</strong>

          <div>
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </div>

          <p>{r.comment}</p>

          <div>
            {r.images?.map((img, i) => (
              <img key={i} src={img} width="80" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewSection;
