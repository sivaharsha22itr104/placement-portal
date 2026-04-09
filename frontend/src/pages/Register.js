import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    cgpa: "",
    skills: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        cgpa: Number(formData.cgpa),
        skills: formData.skills.split(",").map((skill) => skill.trim()),
      };

      const res = await axios.post("http://localhost:5000/api/students/register", payload);
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="auth-card register-wide">
        <h2 className="auth-title">Student Register</h2>
        <p className="auth-subtitle">Create your account to start applying for companies</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />

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
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            name="department"
            type="text"
            placeholder="Enter department (e.g. IT)"
            value={formData.department}
            onChange={handleChange}
          />

          <input
            name="cgpa"
            type="number"
            step="0.01"
            placeholder="Enter CGPA"
            value={formData.cgpa}
            onChange={handleChange}
          />

          <input
            name="skills"
            type="text"
            placeholder="Enter skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
          />

          <button className="btn auth-btn" type="submit">
            Register
          </button>
        </form>

        <p className="bottom-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;