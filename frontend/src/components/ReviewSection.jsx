import { useEffect, useState } from "react";
import api from "../api/axios";
import RatingStats from "./RatingStats";
function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN gửi đi:", token);

      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", comment);
      formData.append("productId", productId);

      images.forEach((img) => {
        formData.append("images", img);
      });

      await api.post("/reviews", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 ép cứng
        },
      });

      setComment("");
      setImages([]);
      fetchReviews();
    } catch (err) {
      console.log(err.response?.data);
    }
  };
  return (
    <div style={{ marginTop: "40px" }}>
      <div
        style={{
          marginTop: "40px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <h2>ĐÁNH GIÁ - NHẬN XÉT TỪ KHÁCH HÀNG</h2>

        <div style={{ display: "flex", gap: "40px" }}>
          {/* ⭐ LEFT: Tổng rating */}
          <div>
            <h1 style={{ fontSize: "40px" }}>{avg}</h1>

            <div>
              {"★".repeat(Math.round(avg))}
              {"☆".repeat(5 - Math.round(avg))}
            </div>

            <p>{reviews.length} đánh giá</p>

            {/* 📊 Thanh rating */}
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const percent = reviews.length
                ? (count / reviews.length) * 100
                : 0;

              return (
                <div
                  key={star}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <span>{star}⭐</span>

                  <div
                    style={{
                      width: "150px",
                      height: "8px",
                      background: "#eee",
                      margin: "0 10px",
                      borderRadius: "5px",
                    }}
                  >
                    <div
                      style={{
                        width: `${percent}%`,
                        height: "100%",
                        background: "gold",
                        borderRadius: "5px",
                      }}
                    />
                  </div>

                  <span>{count}</span>
                </div>
              );
            })}
          </div>

          {/* 🖼 CENTER: Ảnh review */}
          <div>
            <h4>Hình ảnh đánh giá</h4>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                maxWidth: "300px",
              }}
            >
              {reviews
                .flatMap((r) => r.images || [])
                .slice(0, 8)
                .map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    width="60"
                    height="60"
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                ))}
            </div>
          </div>

          {/* ✍️ RIGHT: Form */}
          <div>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: "#2d8cf0",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Gửi đánh giá của bạn
            </button>

            {showForm && (
              <div style={{ marginTop: "20px" }}>
                {/* ⭐ chọn sao */}
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

                {/* 💬 */}
                <textarea
                  placeholder="Nhập đánh giá..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                {/* 📸 */}
                <input
                  type="file"
                  multiple
                  onChange={(e) => setImages([...e.target.files])}
                />

                {/* preview */}
                <div>
                  {images.map((img, i) => (
                    <img key={i} src={URL.createObjectURL(img)} width="60" />
                  ))}
                </div>

                <button onClick={handleSubmit}>Gửi</button>
              </div>
            )}
          </div>
        </div>
      </div>
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
