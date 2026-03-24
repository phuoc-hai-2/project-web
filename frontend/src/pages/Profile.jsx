import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/auth/profile")
      .then(({ data }) => {
        setName(data.name);
        setEmail(data.email);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      const updateData = { name, email };
      if (password) updateData.password = password;

      const { data } = await api.put("/auth/profile", updateData);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setSuccess("Cập nhật hồ sơ thành công!");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container className="my-5 d-flex justify-content-center">
        <Card style={{ maxWidth: "500px", width: "100%" }} className="shadow-sm">
          <Card.Header className="bg-primary text-white text-center py-3">
            <h4 className="mb-0">👤 Hồ sơ cá nhân</h4>
          </Card.Header>
          <Card.Body className="p-4">
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Tên</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Mật khẩu mới (để trống nếu không đổi)</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Xác nhận mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 fw-bold"
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default Profile;
