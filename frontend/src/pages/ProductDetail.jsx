import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Footer from "../components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (error) {
        navigate("/");
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const addToCartHandler = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const cartKey = userInfo ? `cart_${userInfo._id}` : "cart_guest";
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existItem = cartItems.find((x) => x.product === product._id);

    let updatedCart;
    if (existItem) {
      updatedCart = cartItems.map((x) =>
        x.product === existItem.product
          ? { ...x, qty: Number(x.qty) + Number(qty) }
          : x,
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: Number(qty),
        },
      ];
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    navigate("/cart");
  };

  return (
    <>
      <Header />
      <Container className="my-5">
        <Button
          variant="outline-secondary"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <i className="bi bi-arrow-left me-2"></i> Trở về
        </Button>
        {product.name && (
          <Row className="bg-white p-4 shadow-sm rounded">
            <Col md={5} className="text-center">
              <Image
                src={product.image}
                alt={product.name}
                fluid
                className="rounded shadow-sm"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0 px-0">
                  <h2 className="fw-bold text-dark">{product.name}</h2>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0 text-muted">
                  Danh mục: {product.category}
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <h3 className="text-danger fw-bold">
                    {product.price.toLocaleString()} VND
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0 mt-3">
                  <h5>Mô tả chi tiết:</h5>
                  <p
                    className="text-secondary"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {product.description}
                  </p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between py-3">
                    <span>Trạng thái:</span>
                    <span className="text-success fw-bold">Còn hàng</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                    <span>Số lượng:</span>
                    <Form.Control
                      as="select"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      style={{ width: "80px" }}
                    >
                      {[...Array(10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </ListGroup.Item>
                  <ListGroup.Item className="py-3">
                    <Row>
                      <Col>
                        <Button
                          className="fw-bold me-2 h-100"
                          variant="primary"
                        >
                          Mua ngay
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          className=" fw-bold me-2 h-80"
                          variant="primary"
                          onClick={addToCartHandler}
                        >
                          Thêm vào giỏ hàng
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetail;
