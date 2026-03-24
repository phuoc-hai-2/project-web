import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        // Giả định Backend của bạn có API này để lấy đơn hàng của user đang đăng nhập
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (error) {
        console.error("Lỗi tải lịch sử đơn hàng:", error);
        // Nếu lỗi do chưa đăng nhập (401), hất về trang login
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate]);

  return (
    <>
      <Header />
      <Container className="my-5 min-vh-100">
        <h2 className="mb-4 fw-bold text-primary">Lịch sử mua hàng</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-2 text-muted">Đang tải dữ liệu đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="alert alert-info shadow-sm p-4 text-center">
            Bạn chưa có đơn hàng nào. <br />
            <Link to="/home" className="btn btn-primary mt-3 fw-bold">
              Bắt đầu mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="bg-white p-4 shadow-sm rounded">
            <Table responsive hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày mua</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái Key</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="fw-bold text-secondary">
                      {order._id.substring(0, 8)}... {/* Cắt ngắn ID cho gọn */}
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="fw-bold text-danger">
                      {order.totalPrice.toLocaleString()} đ
                    </td>
                    <td>
                      {order.isPaid ? (
                        <Badge bg="success" pill>
                          Đã thanh toán
                        </Badge>
                      ) : (
                        <Badge bg="warning" text="dark" pill>
                          Chưa thanh toán
                        </Badge>
                      )}
                    </td>
                    <td>
                      {order.status === "Completed" ? (
                        <Badge bg="info" pill>
                          Đã giao Key
                        </Badge>
                      ) : (
                        <Badge bg="secondary" pill>
                          Đang xử lý
                        </Badge>
                      )}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="fw-bold"
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        Xem Chi Tiết / Nhận Key
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default OrderHistory;