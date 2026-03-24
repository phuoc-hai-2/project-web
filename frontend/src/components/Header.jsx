import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/home?keyword=${keyword}`);
    } else {
      navigate("/home");
    }
  };
  return (
    <>
      <header className="header">
        <Navbar className="navbar-list">
          <Container
            style={{
              paddingLeft: "100px",
              paddingRight: "100px",
            }}
          >
            <Col>
              <Row md={4}>
                <Navbar.Brand
                  href="#"
                  style={{ width: "200px" }}
                  onClick={() => navigate("/home")}
                >
                  <h1 style={{ color: "white" }}>
                    DIGITAL <br /> STORE
                  </h1>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                  <Form className="search-form" onSubmit={submitHandler}>
                    <div className="search-box">
                      <Form.Control
                        type="search"
                        placeholder="Nhập nội dung cần tìm..."
                        className="search-input"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                      <button type="submit" className="search-btn">
                        🔍
                      </button>
                    </div>
                  </Form>
                  <Nav
                    className="ms-auto my-2 my-lg-0"
                    style={{ maxHeight: "100px" }}
                    navbarScroll
                  >
                    {userInfo ? (
                      <>
                        {userInfo.role === "admin" ? (
                          <NavDropdown title={`👑 ${userInfo.name}`} id="admin-dropdown" className="me-2">
                            <NavDropdown.Item onClick={() => navigate("/admin")}>📊 Dashboard</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate("/admin/products")}>📦 Sản phẩm</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate("/admin/orders")}>🧾 Đơn hàng</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate("/admin/users")}>👥 Người dùng</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate("/admin/reviews")}>⭐ Reviews</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logout} className="text-danger">Đăng xuất</NavDropdown.Item>
                          </NavDropdown>
                        ) : (
                          <NavDropdown title={`👤 ${userInfo.name}`} id="user-dropdown" className="me-2">
                            <NavDropdown.Item onClick={() => navigate("/profile")}>Hồ sơ cá nhân</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate("/orders")}>Lịch sử đơn hàng</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logout} className="text-danger">Đăng xuất</NavDropdown.Item>
                          </NavDropdown>
                        )}
                      </>
                    ) : (
                      <Button
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => navigate("/login")}
                      >
                        Đăng nhập
                      </Button>
                    )}
                    <Button
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => navigate("/cart")}
                    >
                      🛒 Giỏ Hàng
                    </Button>
                  </Nav>
                </Navbar.Collapse>
              </Row>
              <Row>
                <div className="menu-wrapper">
                  <button
                    className="category-btn"
                    onClick={() => navigate("/category/:slug")}
                  >
                    Danh mục
                  </button>
                </div>
              </Row>
            </Col>
          </Container>
        </Navbar>
      </header>
    </>
  );
}
export default Header;
