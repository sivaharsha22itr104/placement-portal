import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/login`, formData);
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      alert("Admin login successful");
      navigate("/admin");
    } catch (error) {
      alert(error.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2 className="auth-title">Admin Login</h2>
        <p className="auth-subtitle">Login to manage companies and applications</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="email"
            type="email"
            placeholder="Enter admin email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="auth-links">
            <span className="muted-link">Forgot Password?</span>
          </div>

          <button className="btn auth-btn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;