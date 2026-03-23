import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Header() {
  const navigate = useNavigate();
  // const [show, setShow] = useState(false);
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
                        <span className="navbar-text me-3 fw-bold text-primary">
                          Chào, {userInfo.name}
                        </span>
                        {userInfo.role === "admin" && (
                          <Button
                            variant="outline-dark"
                            className="me-2"
                            onClick={() => navigate("/admin/product/add")}
                          >
                            Thêm Sản Phẩm
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          className="me-2"
                          onClick={logout}
                        >
                          Đăng xuất
                        </Button>
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
                    {/* <Button
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => navigate("/login")}
                    >
                      <i className="bi bi-person-circle me-2"></i>
                      Đăng nhập
                    </Button> */}
                    <Button
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => navigate("/cart")}
                    >
                      Giỏ Hàng
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

                  {/* {show && (
                    <div className="mega-menu">
                      <Container>
                        <Row>
                          <Col md={3}>
                            <h5>Danh mục</h5>
                            <ul></ul>
                          </Col>

                          <Col md={3}>
                            <ul></ul>
                          </Col>

                          <Col md={3}>
                            <h5>Thương hiệu</h5>
                            <ul></ul>
                          </Col>

                          <Col md={3}>
                            <h5>Tìm kiếm nhiều</h5>
                            <ul></ul>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  )} */}
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
