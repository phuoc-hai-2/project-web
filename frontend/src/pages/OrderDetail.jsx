import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const OrderDetail = () => {
  const { id } = useParams(); // Lấy ID đơn hàng từ URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error("Lỗi tải chi tiết đơn hàng:", error);
        alert("Không thể tải thông tin đơn hàng hoặc bạn không có quyền xem!");
        navigate("/order-history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <Container className="my-5 text-center min-vh-100">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Đang mở két sắt...</p>
        </Container>
        <Footer />
      </>
    );
  }

  if (!order) return null;

  return (
    <>
      <Header />
      <Container className="my-5 min-vh-100">
        <Button 
          variant="outline-secondary" 
          className="mb-4" 
          onClick={() => navigate("/order-history")}
        >
          <i className="bi bi-arrow-left me-2"></i> Quay lại lịch sử
        </Button>

        <h2 className="mb-4 fw-bold">Chi Tiết Đơn Hàng: <span className="text-primary">#{order._id.substring(0, 8)}</span></h2>

        <Row>
          {/* CỘT TRÁI: THÔNG TIN SẢN PHẨM & KEY */}
          <Col md={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white py-3">
                <h4 className="mb-0 fw-bold">Sản phẩm đã mua</h4>
              </Card.Header>
              <Card.Body>
                <Table responsive hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-center">Số lượng</th>
                      <th className="text-end">Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", marginRight: "15px" }} 
                            />
                            <Link to={`/product/${item.product}`} className="text-decoration-none text-dark fw-bold">
                              {item.name}
                            </Link>
                          </div>
                        </td>
                        <td className="text-center fw-bold">{item.qty}</td>
                        <td className="text-end text-danger fw-bold">{(item.price * item.qty).toLocaleString()} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* KHU VỰC QUAN TRỌNG NHẤT: HIỂN THỊ KEY */}
            <Card className="shadow-sm border-primary mb-4">
              <Card.Header className="bg-primary text-white py-3">
                <h4 className="mb-0 fw-bold"><i className="bi bi-key-fill me-2"></i> Két Sắt Kỹ Thuật Số (Digital Keys)</h4>
              </Card.Header>
              <Card.Body className="bg-light">
                {order.isPaid ? (
                  <div className="alert alert-success border-success">
                    <h5 className="alert-heading fw-bold">Thanh toán thành công!</h5>
                    <p>Dưới đây là mã Key / Tài khoản của bạn. Vui lòng bảo mật thông tin này.</p>
                    <hr />
                    {/* Giả định Backend trả về mảng assignedKeys hoặc thông tin digitalDelivery */}
                    {order.assignedKeys && order.assignedKeys.length > 0 ? (
                      <ul className="list-unstyled mb-0 font-monospace fs-5">
                        {order.assignedKeys.map((key, i) => (
                          <li key={i} className="bg-white p-2 mb-2 border rounded text-center fw-bold text-danger shadow-sm">
                            {key}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mb-0 text-muted fst-italic">
                        Hệ thống đang xuất Key, vui lòng tải lại trang sau ít phút hoặc kiểm tra Email: <strong>{order.digitalDeliveryInfo?.emailReceive}</strong>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="alert alert-warning text-center border-warning">
                    <h5 className="fw-bold">Đơn hàng chưa được thanh toán</h5>
                    <p className="mb-0">Key sẽ được hiển thị tại đây ngay sau khi hệ thống xác nhận thanh toán thành công.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* CỘT PHẢI: THÔNG TIN THANH TOÁN & KHÁCH HÀNG */}
          <Col md={4}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0 fw-bold">Tóm tắt thanh toán</h5>
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between py-3">
                  <span className="text-muted">Phương thức:</span>
                  <span className="fw-bold">{order.paymentMethod || "VNPAY"}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between py-3">
                  <span className="text-muted">Tổng tiền:</span>
                  <span className="fw-bold text-danger fs-5">{order.totalPrice.toLocaleString()} VNĐ</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between py-3 align-items-center">
                  <span className="text-muted">Trạng thái:</span>
                  {order.isPaid ? (
                    <Badge bg="success" className="p-2 fs-6">Đã thanh toán</Badge>
                  ) : (
                    <Badge bg="warning" text="dark" className="p-2 fs-6">Chưa thanh toán</Badge>
                  )}
                </ListGroup.Item>
                {order.isPaid && order.paidAt && (
                  <ListGroup.Item className="py-3 text-center text-muted small">
                    Thanh toán lúc: {new Date(order.paidAt).toLocaleString("vi-VN")}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>

            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0 fw-bold">Thông tin nhận hàng</h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-2"><strong className="text-muted">Email nhận Key:</strong> <br/> {order.digitalDeliveryInfo?.emailReceive || order.user?.email}</p>
                <p className="mb-0"><strong className="text-muted">Người đặt:</strong> <br/> {order.user?.name}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default OrderDetail;