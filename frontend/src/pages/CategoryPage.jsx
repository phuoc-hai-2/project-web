import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Menu from "../components/Menu";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../components/Header";
import Footer from "../components/Footer";
function CategoryPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/category/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setCategory(data.category);
        setProducts(data.products);
      })
      .catch((err) => console.log(err));
  }, [slug]);

  return (
    <>
      <Header />
      <Container>
        <Row>
          <Col>
            <h1>Danh mục: {category}</h1>
            <Menu />
          </Col>
          <Col>
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {products.map((p) => (
                  <div
                    key={p._id}
                    style={{ border: "1px solid #ccc", padding: "10px" }}
                  >
                    <img src={p.image} width="150" />
                    <h3>{p.name}</h3>
                    <p>{p.price} VND</p>
                    <p>Còn: {p.availableKeys}</p>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default CategoryPage;
