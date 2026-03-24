import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const STATUS_VARIANTS = {
  Pending: "warning",
  Processing: "info",
  Completed: "success",
  Cancelled: "secondary",
  Refunded: "danger",
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  return (
    <>
      <Header />
      <Container className="my-5">
        <h2 className="mb-4 fw-bold">📦 Lịch sử đơn hàng</h2>

        {loading ? (
          <div className="text-center"><div className="spinner-border text-primary"></div></div>
        ) : orders.length === 0 ? (
          <div className="alert alert-info">
            Bạn chưa có đơn hàng nào.{" "}
            <a href="/" className="fw-bold">Mua sắm ngay</a>
          </div>
        ) : (
          <Table responsive hover className="shadow-sm bg-white align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã đơn hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontSize: "12px" }}>{order._id}</td>
                  <td>
                    {order.orderItems?.map((item) => (
                      <div key={item.product}>{item.name} x{item.qty}</div>
                    ))}
                  </td>
                  <td className="fw-bold text-danger">{order.totalPrice?.toLocaleString()} VND</td>
                  <td>
                    {order.isPaid ? (
                      <Badge bg="success">Đã thanh toán</Badge>
                    ) : (
                      <Badge bg="warning" text="dark">Chưa thanh toán</Badge>
                    )}
                  </td>
                  <td>
                    <Badge bg={STATUS_VARIANTS[order.status] || "secondary"}>
                      {order.status}
                    </Badge>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                    >
                      Xem
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Order Detail Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết đơn hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <div>
                <p><strong>Mã đơn:</strong> {selectedOrder._id}</p>
                <p><strong>Tổng tiền:</strong> {selectedOrder.totalPrice?.toLocaleString()} VND</p>
                <p><strong>Trạng thái:</strong> <Badge bg={STATUS_VARIANTS[selectedOrder.status]}>{selectedOrder.status}</Badge></p>
                <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}</p>
                {selectedOrder.paymentResult?.id && (
                  <p><strong>Transaction ID:</strong> {selectedOrder.paymentResult.id}</p>
                )}
                <hr />
                <h6>Sản phẩm:</h6>
                {selectedOrder.orderItems?.map((item, i) => (
                  <div key={i} className="mb-3 p-3 border rounded">
                    <p className="mb-1 fw-bold">{item.name}</p>
                    <p className="mb-1">Số lượng: {item.qty} | Giá: {item.price?.toLocaleString()} VND</p>
                    {item.deliveredContent ? (
                      <div className="alert alert-success py-2 mb-0">
                        🔑 <strong>Mã Key:</strong> {item.deliveredContent}
                      </div>
                    ) : (
                      <div className="alert alert-warning py-2 mb-0">
                        ⏳ Đang xử lý...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Container>
      <Footer />
    </>
  );
};

export default OrderHistory;
