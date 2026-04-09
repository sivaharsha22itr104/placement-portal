import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function AdminDashboard() {
  const navigate = useNavigate();

  const [companies] = useState([]);
  const [applications, setApplications] = useState([]);

  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    package: "",
    eligibilityCgpa: "",
    eligibleDepartments: "",
    deadline: "",
    location: "",
  });

  useEffect(() => {
    fetchCompanies();
    fetchApplications();
    // eslint-disable-next-line
  }, []);

  const fetchCompanies = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/companies`);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/companies`);
      setApplications(res.data.applications || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        package: Number(formData.package),
        eligibilityCgpa: Number(formData.eligibilityCgpa),
        eligibleDepartments: formData.eligibleDepartments
          .split(",")
          .map((d) => d.trim()),
      };

      await axios.post(`${API_BASE_URL}/api/companies/add`, payload);

      alert("Company added successfully");

      setFormData({
        companyName: "",
        role: "",
        package: "",
        eligibilityCgpa: "",
        eligibleDepartments: "",
        deadline: "",
        location: "",
      });

      fetchCompanies();
    } catch (error) {
      alert(error.response?.data?.message || "Error adding company");
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/applications/status/${applicationId}`, { status });
      fetchApplications();
    } catch (error) {
      alert("Error updating status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/");
  };

  const shortlistedCount = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const selectedCount = applications.filter(
    (app) => app.status === "Selected"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const appliedCount = applications.filter(
    (app) => app.status === "Applied"
  ).length;

  const barData = [
    { name: "Applied", count: appliedCount },
    { name: "Shortlisted", count: shortlistedCount },
    { name: "Selected", count: selectedCount },
    { name: "Rejected", count: rejectedCount },
  ];

  const pieData = [
    { name: "Applied", value: appliedCount },
    { name: "Shortlisted", value: shortlistedCount },
    { name: "Selected", value: selectedCount },
    { name: "Rejected", value: rejectedCount },
  ];

  const COLORS = ["#3b82f6", "#f59e0b", "#16a34a", "#dc2626"];

  const getStatusColor = (status) => {
    if (status === "Selected") return "green";
    if (status === "Rejected") return "red";
    if (status === "Shortlisted") return "orange";
    return "blue";
  };

  return (
    <div className="container">
      <div className="top-actions">

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2 className="page-title">Admin Dashboard</h2>

      <div className="card">
        <h3>Add Company</h3>

        <form onSubmit={handleAddCompany} className="admin-form">
          <input
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
          />
          <input
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
          />
          <input
            name="package"
            placeholder="Package"
            value={formData.package}
            onChange={handleChange}
          />
          <input
            name="eligibilityCgpa"
            placeholder="Eligibility CGPA"
            value={formData.eligibilityCgpa}
            onChange={handleChange}
          />
          <input
            name="eligibleDepartments"
            placeholder="Departments (IT,CSE)"
            value={formData.eligibleDepartments}
            onChange={handleChange}
          />
          <input
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
          />
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />

          <button className="btn" type="submit">
            Add Company
          </button>
        </form>
      </div>

      <div className="stats">
        <div className="stat-box">
          <h3>Total Companies</h3>
          <p>{companies.length}</p>
        </div>

        <div className="stat-box">
          <h3>Total Applications</h3>
          <p>{applications.length}</p>
        </div>

        <div className="stat-box">
          <h3>Selected</h3>
          <p>{selectedCount}</p>
        </div>

        <div className="stat-box">
          <h3>Rejected</h3>
          <p>{rejectedCount}</p>
        </div>
      </div>

      <div className="card">
        <h3>Application Status Overview</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>Status Distribution</h3>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 style={{ marginTop: "20px" }}>Applications</h3>

      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        applications.map((app) => (
          <div className="card" key={app._id}>
            <p><strong>Student:</strong> {app.studentId?.name}</p>
            <p><strong>Email:</strong> {app.studentId?.email}</p>
            <p><strong>Department:</strong> {app.studentId?.department}</p>
            <p><strong>Company:</strong> {app.companyId?.companyName}</p>
            <p><strong>Role:</strong> {app.companyId?.role}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: getStatusColor(app.status),
                  fontWeight: "bold",
                }}
              >
                {app.status}
              </span>
            </p>

            <div className="button-group">
              <button
                className="btn"
                onClick={() => updateStatus(app._id, "Shortlisted")}
              >
                Shortlist
              </button>
              <button
                className="btn btn-danger"
                onClick={() => updateStatus(app._id, "Rejected")}
              >
                Reject
              </button>
              <button
                className="btn btn-success"
                onClick={() => updateStatus(app._id, "Selected")}
              >
                Select
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;