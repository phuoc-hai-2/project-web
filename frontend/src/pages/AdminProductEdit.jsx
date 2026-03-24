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
  const [productType, setProductType] = useState("Key");
  const [availableKeys, setAvailableKeys] = useState(0);
  const [newKeys, setNewKeys] = useState("");
  const [addingKeys, setAddingKeys] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setDescription(data.description);
        setCategory(data.category);
        setProductType(data.productType || "Key");
        setAvailableKeys(data.availableKeys || 0);
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
      const { data } = await api.post("/upload", formData);
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
        productType,
      });
      alert("Cập nhật sản phẩm thành công");
      navigate("/");
    } catch (error) {
      alert("Lỗi cập nhật sản phẩm");
    }
  };

  const addKeysHandler = async () => {
    const keyList = newKeys
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keyList.length === 0) {
      alert("Vui lòng nhập ít nhất một mã Key!");
      return;
    }

    setAddingKeys(true);
    try {
      const { data } = await api.post(`/products/${id}/keys`, { keys: keyList });
      alert(data.message);
      setNewKeys("");
      setAvailableKeys(data.totalInStock);
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi nạp Key vào kho");
    } finally {
      setAddingKeys(false);
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
                <Form.Label className="fw-bold">Loại sản phẩm</Form.Label>
                <Form.Select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                >
                  <option value="Key">Key – Giao mã tự động</option>
                  <option value="Service">Service – Nâng cấp thủ công</option>
                </Form.Select>
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

            {productType === "Key" && (
              <>
                <hr className="my-4" />
                <h5 className="fw-bold mb-3">
                  🔑 Kho Key — Còn lại: <span className="text-success">{availableKeys}</span> mã
                </h5>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-bold">Nạp Key mới (mỗi dòng một mã)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder={"ABCD-1234-EFGH\nXYZW-5678-MNOP\n..."}
                    value={newKeys}
                    onChange={(e) => setNewKeys(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="success"
                  className="w-100 fw-bold"
                  onClick={addKeysHandler}
                  disabled={addingKeys}
                >
                  {addingKeys ? "Đang nạp..." : "Nạp Key vào kho"}
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default AdminProductEdit;
