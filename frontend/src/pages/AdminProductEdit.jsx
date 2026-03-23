import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Footer from "../components/Footer";
const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setDescription(data.description);
        setCategory(data.category);
      } catch (error) {
        alert("Không tìm thấy sản phẩm");
        navigate("/");
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await api.post("/upload", formData, config);
      setImage(data);
    } catch (error) {
      alert("Lỗi tải ảnh lên");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${id}`, {
        name,
        price: Number(price),
        image,
        description,
        category,
      });
      alert("Cập nhật sản phẩm thành công");
      navigate("/");
    } catch (error) {
      alert("Lỗi cập nhật sản phẩm");
    }
  };

  return (
    <>
      <Header />
      <Container className="d-flex justify-content-center">
        <Card className="shadow-sm w-100" style={{ maxWidth: "800px" }}>
          <Card.Header className="bg-warning text-dark text-center py-2">
            <h3 className="mb-0 fw-bold">Chỉnh Sửa Sản Phẩm</h3>
          </Card.Header>
          <Card.Body className="p-3">
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Tên sản phẩm</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Giá (VND)</Form.Label>
                <Form.Control
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Hình ảnh</Form.Label>
                <Form.Control type="file" onChange={uploadFileHandler} />
                {image && (
                  <div className="mt-3">
                    <img
                      src={image}
                      alt="Preview"
                      style={{ width: "120px", borderRadius: "8px" }}
                    />
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Danh mục (Có thể tự gõ mới)
                </Form.Label>
                <Form.Control
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="warning"
                size="lg"
                className="w-100 fw-bold text-dark"
              >
                Lưu Thay Đổi
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default AdminProductEdit;
