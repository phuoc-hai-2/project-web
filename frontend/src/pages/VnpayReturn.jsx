import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";

const VnpayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const errorMsg = searchParams.get("error");

    if (success === "true" && orderId) {
      // Fetch order details
      api.get(`/orders/${orderId}`)
        .then((res) => {
          setOrder(res.data);
          setStatus("success");
          setMessage("Thanh toán thành công! Mã Key đã được giao trong đơn hàng.");
        })
        .catch(() => {
          setStatus("success");
          setMessage("Thanh toán thành công!");
        });
    } else if (success === "false") {
      setStatus("error");
      setMessage(errorMsg || "Thanh toán thất bại hoặc bị hủy.");
    } else {
      setStatus("error");
      setMessage("Không xác định được trạng thái thanh toán.");
    }
  }, [searchParams]);

  return (
    <>
      <Header />
      <Container className="my-5 text-center">
        {status === "loading" && (
          <div>
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Đang xử lý thanh toán...</p>
          </div>
        )}
        {status === "success" && (
          <div>
            <div className="alert alert-success fs-5">✅ {message}</div>
            {order && (
              <div className="mt-4 text-start card p-4 shadow-sm">
                <h4>Chi tiết đơn hàng #{order._id}</h4>
                <p><strong>Trạng thái:</strong> <span className="text-success fw-bold">{order.status}</span></p>
                <p><strong>Tổng tiền:</strong> {order.totalPrice?.toLocaleString()} VND</p>
                <h5 className="mt-3">Sản phẩm đã mua:</h5>
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="border-top pt-2 mt-2">
                    <p className="fw-bold mb-1">{item.name}</p>
                    {item.deliveredContent ? (
                      <p className="text-success mb-0">🔑 Key: <strong>{item.deliveredContent}</strong></p>
                    ) : (
                      <p className="text-warning mb-0">⏳ Đang xử lý...</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <button className="btn btn-primary" onClick={() => navigate("/orders")}>Xem lịch sử đơn hàng</button>
              <button className="btn btn-outline-secondary ms-3" onClick={() => navigate("/")}>Về trang chủ</button>
            </div>
          </div>
        )}
        {status === "error" && (
          <div>
            <div className="alert alert-danger fs-5">❌ {message}</div>
            <button className="btn btn-outline-secondary" onClick={() => navigate("/cart")}>Quay lại giỏ hàng</button>
          </div>
        )}
      </Container>
    </>
  );
};

export default VnpayReturn;
