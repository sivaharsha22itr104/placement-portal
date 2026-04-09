import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
function Dashboard() {
  const [applications, setApplications] = useState([]);
  const student = JSON.parse(localStorage.getItem("student"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/applications/student/${student._id || student.id}`);
      setApplications(res.data.applications);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Selected":
        return "green";
      case "Rejected":
        return "red";
      case "Shortlisted":
        return "orange";
      default:
        return "#2563eb";
    }
  };

  return (
    <div className="container">
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-card">
        <h2>🎓 Student Dashboard</h2>

        <div className="student-info">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>CGPA:</strong> {student.cgpa}</p>
        </div>

        <div className="dashboard-actions">
          <button className="action-btn" onClick={() => navigate("/companies")}>
            View Companies
          </button>

        </div>

        <h3 style={{ marginTop: "25px" }}>📌 My Applications</h3>

        {applications.length === 0 ? (
          <p>No applications found</p>
        ) : (
          <div className="application-list">
            {applications.map((app) => (
              <div className="application-card" key={app._id}>
                <h4>{app.companyId.companyName}</h4>
                <p>{app.companyId.role}</p>
                <p>💰 {app.companyId.package} LPA</p>

                <span
                  className="status-badge"
                  style={{ background: getStatusColor(app.status) }}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;