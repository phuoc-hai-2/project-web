import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Footer from "../components/Footer";

const AdminProductAdd = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categoryOption, setCategoryOption] = useState("Giải trí");
  const [customCategory, setCustomCategory] = useState("");
  const [productType, setProductType] = useState("Key");

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
    const finalCategory =
      categoryOption === "Khác" ? customCategory : categoryOption;

    if (categoryOption === "Khác" && !customCategory.trim()) {
      alert("Vui lòng nhập tên danh mục mới!");
      return;
    }

    try {
      await api.post("/products", {
        name,
        price: Number(price),
        image,
        description,
        category: finalCategory,
        productType,
      });
      alert("Thêm sản phẩm thành công");
      navigate("/");
    } catch (error) {
      alert("Lỗi thêm sản phẩm");
    }
  };

  return (
    <>
      <Header />
      <Container className="d-flex justify-content-center">
        <Card className="shadow-sm w-100" style={{ maxWidth: "800px" }}>
          <Card.Header className="bg-primary text-white text-center py-3">
            <h3 className="mb-0">Thêm Sản Phẩm Mới</h3>
          </Card.Header>
          <Card.Body className="p-4 ">
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Tên sản phẩm</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Giá (VND)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ví dụ: 50000"
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Hình ảnh</Form.Label>
                <Form.Control
                  type="file"
                  onChange={uploadFileHandler}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Danh mục</Form.Label>
                <Form.Select
                  className="mb-2"
                  value={categoryOption}
                  onChange={(e) => setCategoryOption(e.target.value)}
                >
                  <option value="Giải trí">
                    Giải trí (Netflix, Spotify...)
                  </option>
                  <option value="Hệ điều hành">
                    Hệ điều hành (Windows...)
                  </option>
                  <option value="Phần mềm">
                    Phần mềm văn phòng (Office...)
                  </option>
                  <option value="Game">Game (Steam, Epic...)</option>
                  <option value="Khác">Khác (Tự nhập)</option>
                </Form.Select>
                {categoryOption === "Khác" && (
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên danh mục mới..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    required
                  />
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Loại sản phẩm</Form.Label>
                <Form.Select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                >
                  <option value="Key">Key – Giao mã tự động</option>
                  <option value="Service">Service – Nâng cấp thủ công</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-100 fw-bold"
              >
                Lưu Sản Phẩm
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default AdminProductAdd;
