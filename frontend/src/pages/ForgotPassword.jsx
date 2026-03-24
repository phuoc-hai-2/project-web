import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const { data } = await api.post("/auth/forgot-password", { email });
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi gửi email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container className="my-5 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Card style={{ maxWidth: "400px", width: "100%" }} className="shadow p-4">
          <h4 className="text-center mb-4 fw-bold">🔑 Quên mật khẩu</h4>

          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email của bạn</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email đã đăng ký..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 fw-bold" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi email đặt lại mật khẩu"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <button className="btn btn-link" onClick={() => navigate("/login")}>
              Quay lại đăng nhập
            </button>
          </div>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default ForgotPassword;
