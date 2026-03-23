import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const data = res.data;
      localStorage.setItem("userInfo", JSON.stringify(data));
      if (data.role === "admin") {
        navigate("/admin/product/add");
      } else {
        navigate("/home");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi không xác định";
      alert("Lỗi đăng nhập: " + errorMessage);
    }
  };

  const [mode, setMode] = useState("login");

  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ width: "350px" }}>
          <div
            className="btn-group w-100 mb-3"
            role="group"
            aria-label="Auth toggle"
          >
            <input
              type="radio"
              className="btn-check"
              name="auth-mode"
              id="btn-login"
              checked={mode === "login"}
              onChange={() => {
                setMode("login");
                navigate("/login");
              }}
            />

            <label className="btn btn-custom" htmlFor="btn-login">
              Login
            </label>

            <input
              type="radio"
              className="btn-check"
              name="auth-mode"
              id="btn-register"
              checked={mode === "register"}
              onChange={() => {
                setMode("register");
                navigate("/register");
              }}
            />

            <label className="btn btn-outline-secondary" htmlFor="btn-register">
              Register
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Login;
