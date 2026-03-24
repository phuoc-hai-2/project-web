function RatingStats({ reviews }) {
  const total = reviews.length;

  const countStar = (star) => reviews.filter((r) => r.rating === star).length;

  return (
    <div>
      <h3>📊 Thống kê</h3>

      {[5, 4, 3, 2, 1].map((star) => {
        const count = countStar(star);
        const percent = total ? (count / total) * 100 : 0;

        return (
          <div key={star}>
            {star}⭐
            <div
              style={{
                display: "inline-block",
                width: "200px",
                height: "10px",
                background: "#ddd",
                margin: "0 10px",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: "100%",
                  background: "gold",
                }}
              />
            </div>
            {count}
          </div>
        );
      })}
    </div>
  );
}

export default RatingStats;
