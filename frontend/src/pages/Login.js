import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
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
      const res = await axios.post("http://localhost:5000/api/students/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("student", JSON.stringify(res.data.student));

      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2 className="auth-title">Student Login</h2>
        <p className="auth-subtitle">Login to access your placement dashboard</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Enter your password"
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

        <p className="bottom-text">
          New to account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;