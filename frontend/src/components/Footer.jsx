import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Footer = (props) => {
  return (
    <>
      {/* Thêm pt-5 (padding-top) và pb-4 (padding-bottom) để Footer đầy đặn hơn */}
      <footer className="footer pt-5 pb-4 mt-5">
        <Container>
          <Row className="gy-4"> {/* gy-4 giúp các cột có khoảng cách khi xem trên điện thoại */}
            
            {/* CỘT 1: LOGO & THÔNG TIN CHUNG */}
            <Col md={4}>
              <img
                src="../src/assets/images/logo.png"
                alt="logo"
                className="footer-logo mb-3" // Thêm margin-bottom
              />

              <p className="mb-3 text-secondary">
                Digital Store | Cửa hàng tài khoản giá rẻ
              </p>

              <div className="social mb-4 fw-bold">
                <span className="text-primary" style={{ cursor: "pointer" }}>Zalo</span> |
                <span className="text-primary" style={{ cursor: "pointer" }}> Facebook</span> |
                <span className="text-primary" style={{ cursor: "pointer" }}> Instagram</span>
              </div>

              <div className="copyright small text-muted">
                Copyright © {new Date().getFullYear()} DigitalStore. All Rights Reserved.
              </div>
            </Col>

            {/* CỘT 2: GIỚI THIỆU */}
            <Col md={2}>
              <h5 className="text-white mb-3 fw-bold">Về chúng tôi</h5>
              <ul className="footer-list list-unstyled" style={{ lineHeight: "2" }}>
                <li style={{ cursor: "pointer" }}>Giới thiệu</li>
                <li style={{ cursor: "pointer" }}>Liên hệ</li>
                <li style={{ cursor: "pointer" }}>Đánh giá</li>
              </ul>
            </Col>

            {/* CỘT 3: HỖ TRỢ */}
            <Col md={3}>
              <h5 className="text-white mb-3 fw-bold">Hỗ trợ khách hàng</h5>
              <ul className="footer-list list-unstyled" style={{ lineHeight: "2" }}>
                <li style={{ cursor: "pointer" }}>Bảo hành và hoàn tiền</li>
                <li style={{ cursor: "pointer" }}>Hướng dẫn mua hàng</li>
                <li style={{ cursor: "pointer" }}>Chính sách bảo mật</li>
              </ul>
            </Col>

            {/* CỘT 4: SẢN PHẨM & THANH TOÁN */}
            <Col md={3}>
              <h5 className="text-white mb-3 fw-bold">Dịch vụ nổi bật</h5>
              <ul className="footer-list list-unstyled mb-4" style={{ lineHeight: "2" }}>
                <li style={{ cursor: "pointer" }}>Mua Spotify Premium</li>
                <li style={{ cursor: "pointer" }}>Mua tài khoản Netflix</li>
                <li style={{ cursor: "pointer" }}>Mua Canva Pro vĩnh viễn</li>
                <li style={{ cursor: "pointer" }}>Mua Adobe bản quyền</li>
                <li style={{ cursor: "pointer" }}>Mua Youtube Premium</li>
              </ul>

              {/* LẤP ĐẦY GÓC PHẢI BẰNG LOGO THANH TOÁN */}
              <div>
                <h6 className="text-secondary small mb-2">Chấp nhận thanh toán:</h6>
                <div className="d-flex gap-2">
                  <img src="https://vnpay.vn/s1/vnpay/assets/images/logo-icon/logo-primary.svg" alt="VNPay" height="24" className="bg-white p-1 rounded shadow-sm" />
                  <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" height="24" className="bg-white p-1 rounded shadow-sm" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo_2014.svg/1200px-Visa_Inc._logo_2014.svg.png" alt="Visa" height="24" className="bg-white p-1 rounded shadow-sm" />
                </div>
              </div>
            </Col>

          </Row>
        </Container>
      </footer>
    </>
  );
};
export default Footer;