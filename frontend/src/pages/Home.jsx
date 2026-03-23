import Headers from "../components/Header";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProduct";
import Container from "react-bootstrap/Container";
import Footer from "../components/Footer";
import Carousel from "react-bootstrap/Carousel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Banner from "../components/banner";
import { useState } from "react";

const Home = () => {
  const products = useProducts();
  const selectedCategory = "Hệ điều hành";
  return (
    <>
      <Headers />
      <Container className="my-4 body">
        <Banner />

        <Row>
          <h2 className="text-center mb-4">Sản phẩm mới nhất</h2>

          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Row>
        <Row>
          <h2 className="text-center mb-4 mt-5">Hệ điều hành</h2>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {products
              .filter((p) => p.category === selectedCategory)
              .map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
          </div>
        </Row>
        <Row className="g-4">
          <Col md={6}>
            <div className="promo-banner">
              <span>MUA HÀNG HÔM NAY</span>
              <h2>ƯU ĐÃI LỚN</h2>
            </div>
          </Col>

          <Col md={6}>
            <div className="info-banner">
              <div className="icon">✔</div>

              <div>
                <h4>UY TÍN AN TOÀN NHANH CHÓNG</h4>
                <p>
                  TẤT CẢ SẢN PHẨM ĐỀU ĐƯỢC KIỂM TRA VÀ BẢO ĐẢM CHO QUÁ TRÌNH SỬ
                  DỤNG ỔN ĐỊNH.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};
export default Home;
