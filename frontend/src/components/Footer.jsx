import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const Footer = (props) => {
  return (
    <>
      <footer className="footer">
        <Container>
          <Row>
            <Col md={4}>
              <img
                src="../src/assets/images/logo.png"
                alt="logo"
                className="footer-logo"
              />

              <p>Digital Store | Cửa hàng tài khoản giá rẻ</p>

              <div className="social">
                <span>Zalo </span> |<span> Facebook</span> |
                <span> Instagram</span>
              </div>

              <div className="copyright">
                Copyright © DigitalStore. All Rights Reserved.
              </div>
            </Col>

            <Col md={2}>
              <ul className="footer-list">
                <li>Giới thiệu</li>
                <li>Liên hệ</li>
                <li>Đánh giá</li>
              </ul>
            </Col>

            <Col md={3}>
              <ul className="footer-list">
                <li>Bảo hành và hoàn tiền</li>
                <li>Hướng dẫn mua hàng</li>
                <li>Chính sách bảo mật</li>
              </ul>
            </Col>

            <Col md={3}>
              <ul className="footer-list">
                <li>Mua Spotify Premium</li>
                <li>Mua tài khoản Netflix</li>
                <li>Mua Canva Pro vĩnh viễn</li>
                <li>Mua Adobe bản quyền</li>
                <li>Mua Youtube Premium</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};
export default Footer;
