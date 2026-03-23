import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import Header from "../components/Header";
import Footer from "../components/Footer";
function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Password không khớp");
      return;
    }
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ width: "380px" }}>
          <div
            className="btn-group w-100 mb-4"
            role="group"
            aria-label="Auth toggle"
          >
            <input
              type="radio"
              className="btn-check"
              name="auth-mode"
              id="btn-login"
              autoComplete="off"
              onClick={() => navigate("/login")}
            />

            <label className="btn btn-outline-secondary" htmlFor="btn-login">
              Login
            </label>

            <input
              type="radio"
              className="btn-check"
              name="auth-mode"
              id="btn-register"
              autoComplete="off"
              defaultChecked
              onClick={() => navigate("/register")}
            />

            <label className="btn btn-custom" htmlFor="btn-register">
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
            <div></div>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Register
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default Register;
