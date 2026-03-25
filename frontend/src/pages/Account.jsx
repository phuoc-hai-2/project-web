import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ LocalStorage
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      // Nếu ranh mãnh mò vào trang này mà chưa đăng nhập thì hất về trang chủ
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return null;

  // Lấy chữ cái đầu tiên của tên làm Avatar
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div style={{ backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Header />
      <Container className="my-5">
        <Row className="gx-4">
          {/* CỘT TRÁI: SIDEBAR MENU */}
          <Col md={3} className="mb-4">
            <Card className="border-0 shadow-sm rounded-4 mb-3">
              <Card.Body className="d-flex align-items-center p-4">
                <div 
                  className="rounded-circle d-flex justify-content-center align-items-center text-white fs-3 fw-bold me-3"
                  style={{ width: "60px", height: "60px", backgroundColor: "#c2185b" }}
                >
                  {initial}
                </div>
                <div>
                  <h5 className="mb-0 fw-bold text-primary">{user.name}</h5>
                  <small className="text-muted">#{user._id?.substring(0, 5) || "47678"}</small>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <ListGroup variant="flush" className="fw-semibold">
                <ListGroup.Item action className="text-primary border-start border-primary border-4 py-3" style={{ backgroundColor: "#f8f9fa" }}>
                  <i className="bi bi-house-door-fill me-2"></i> Trang tài khoản
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => navigate("/order-history")} className="text-secondary py-3 custom-hover">
                  <i className="bi bi-box-seam me-2"></i> Đơn hàng
                </ListGroup.Item>
                <ListGroup.Item action className="text-secondary py-3 custom-hover">
                  <i className="bi bi-wallet2 me-2"></i> Ví của tôi
                </ListGroup.Item>
                <ListGroup.Item action className="text-secondary py-3 custom-hover">
                  <i className="bi bi-people me-2"></i> Cộng tác viên
                </ListGroup.Item>
                <ListGroup.Item action onClick={handleLogout} className="text-danger py-3 custom-hover mt-2 border-top">
                  <i className="bi bi-box-arrow-right me-2"></i> Thoát
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          {/* CỘT PHẢI: NỘI DUNG TỔNG QUAN */}
          <Col md={9}>
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body className="p-5">
                <h4 className="fw-bold mb-4 text-dark" style={{ color: "#2c3e50" }}>Tổng quan</h4>
                
                <Row className="mb-5 gx-5 gy-4">
                  <Col md={3} xs={6}>
                    <div className="text-muted small mb-1">Họ tên</div>
                    <div className="fw-bold text-dark">{user.name}</div>
                  </Col>
                  <Col md={3} xs={6}>
                    <div className="text-muted small mb-1">Email</div>
                    <div className="fw-bold text-dark">{user.email}</div>
                  </Col>
                 
                  <Col md={3} xs={6}>
                    <div className="text-muted small mb-1">Số tiền chi tiêu</div>
                    <div className="fw-bold text-dark">0đ</div>
                  </Col>

                    <Col md={3} xs={6}>
                    <div className="text-muted small mb-1">số đơn hàng</div>
                    <div className="fw-bold text-dark">0</div>
                  </Col> 
                </Row>

                {/* <h5 className="fw-bold mb-4 mt-5 text-dark" style={{ color: "#2c3e50" }}>Đơn hàng của bạn</h5>
                <p className="text-muted">No orders found for this user.</p>
                Sau này bạn có thể lặp danh sách đơn hàng ra đây giống trang OrderHistory */}
                
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Account;