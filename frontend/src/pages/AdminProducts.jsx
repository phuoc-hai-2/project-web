import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const STATUS_VARIANTS = { Published: "success", Draft: "warning", Hidden: "secondary" };

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      alert("Lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      await api.delete(`/products/${productId}`);
      fetchProducts();
    } catch (error) {
      alert("Lỗi khi xóa sản phẩm");
    }
  };

  return (
    <>
      <Header />
      <Container fluid className="my-4 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">📦 Quản lý sản phẩm</h2>
          <Button variant="primary" onClick={() => navigate("/admin/product/add")}>
            + Thêm sản phẩm
          </Button>
        </div>

        {loading ? (
          <div className="text-center"><div className="spinner-border text-primary"></div></div>
        ) : (
          <Table responsive hover className="shadow-sm bg-white align-middle">
            <thead className="table-light">
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th>Kho</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  </td>
                  <td className="fw-bold">{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price?.toLocaleString()} VND</td>
                  <td><Badge bg="info">{product.productType}</Badge></td>
                  <td>
                    <Badge bg={STATUS_VARIANTS[product.status] || "secondary"}>
                      {product.status || "Published"}
                    </Badge>
                  </td>
                  <td>{product.availableKeys ?? "N/A"}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button size="sm" variant="warning" onClick={() => navigate(`/admin/product/edit/${product._id}`)}>
                        Sửa
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(product._id)}>
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="8" className="text-center text-muted">Chưa có sản phẩm</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
};

export default AdminProducts;
