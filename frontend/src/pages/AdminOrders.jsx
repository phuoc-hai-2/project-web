import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const STATUS_VARIANTS = {
  Pending: "warning",
  Processing: "info",
  Completed: "success",
  Cancelled: "secondary",
  Refunded: "danger",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (filterStatus) params.status = filterStatus;
      const { data } = await api.get("/orders/admin", { params });
      setOrders(data.orders);
      setPages(data.pages);
    } catch (error) {
      alert("Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleRefund = async (orderId) => {
    if (!window.confirm("Xác nhận hoàn tiền cho đơn hàng này?")) return;
    try {
      await api.put(`/orders/${orderId}/refund`);
      alert("Hoàn tiền thành công!");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi hoàn tiền");
    }
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <>
      <Header />
      <Container fluid className="my-4 px-4">
        <h2 className="mb-4 fw-bold">🧾 Quản lý đơn hàng</h2>

        <div className="d-flex gap-3 mb-3 align-items-center">
          <Form.Select
            style={{ width: "200px" }}
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </Form.Select>
        </div>

        {loading ? (
          <div className="text-center"><div className="spinner-border text-primary"></div></div>
        ) : (
          <>
            <Table responsive hover className="shadow-sm bg-white align-middle">
              <thead className="table-light">
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontSize: "12px" }}>{order._id}</td>
                    <td>{order.user?.name || "N/A"}<br /><small className="text-muted">{order.user?.email}</small></td>
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
                      <div className="d-flex gap-1 flex-wrap">
                        <Button size="sm" variant="info" onClick={() => handleViewDetail(order)}>Chi tiết</Button>
                        {order.status === "Processing" && (
                          <Button size="sm" variant="success" onClick={() => handleUpdateStatus(order._id, "Completed")}>
                            Hoàn thành
                          </Button>
                        )}
                        {order.isPaid && order.status !== "Refunded" && order.status !== "Completed" && (
                          <Button size="sm" variant="danger" onClick={() => handleRefund(order._id)}>
                            Hoàn tiền
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="7" className="text-center text-muted">Không có đơn hàng</td></tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            <div className="d-flex gap-2 justify-content-center">
              {[...Array(pages).keys()].map((p) => (
                <Button
                  key={p + 1}
                  size="sm"
                  variant={page === p + 1 ? "primary" : "outline-primary"}
                  onClick={() => setPage(p + 1)}
                >
                  {p + 1}
                </Button>
              ))}
            </div>
          </>
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
                <p><strong>Khách hàng:</strong> {selectedOrder.user?.name} ({selectedOrder.user?.email})</p>
                <p><strong>Email nhận hàng:</strong> {selectedOrder.digitalDeliveryInfo?.emailReceive}</p>
                <p><strong>Tổng tiền:</strong> {selectedOrder.totalPrice?.toLocaleString()} VND</p>
                <p><strong>Trạng thái:</strong> <Badge bg={STATUS_VARIANTS[selectedOrder.status]}>{selectedOrder.status}</Badge></p>
                {selectedOrder.paymentResult?.id && (
                  <p><strong>Transaction ID:</strong> {selectedOrder.paymentResult.id}</p>
                )}
                <hr />
                <h6>Sản phẩm:</h6>
                {selectedOrder.orderItems?.map((item, i) => (
                  <div key={i} className="mb-2 p-2 border rounded">
                    <p className="mb-1"><strong>{item.name}</strong> x{item.qty} - {item.price?.toLocaleString()} VND</p>
                    {item.deliveredContent && (
                      <p className="mb-0 text-success">🔑 {item.deliveredContent}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default AdminOrders;
