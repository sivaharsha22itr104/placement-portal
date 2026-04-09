import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const student = JSON.parse(localStorage.getItem("student"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/companies");
      setCompanies(res.data.companies || []);
    } catch (error) {
      alert(error.response?.data?.message || "Could not load companies");
    } finally {
      setLoading(false);
    }
  };

  const applyToCompany = async (companyId) => {
    try {
      if (!student) {
        alert("Please login first");
        return;
      }

      await axios.post("http://localhost:5000/api/applications/apply", {
        studentId: student.id || student._id,
        companyId,
      });

      alert("Applied successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Error applying");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    navigate("/");
  };

  return (
    <div className="container">
      <div className="top-actions">
        <button className="action-btn secondary" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2 className="page-title">Available Companies</h2>

      {loading ? (
        <p>Loading companies...</p>
      ) : companies.length === 0 ? (
        <p>No companies found</p>
      ) : (
        companies.map((company) => (
          <div className="card" key={company._id}>
            <h3>{company.companyName}</h3>
            <p><strong>Role:</strong> {company.role}</p>
            <p><strong>Package:</strong> {company.package} LPA</p>
            <p><strong>Eligibility CGPA:</strong> {company.eligibilityCgpa}</p>
            <p><strong>Departments:</strong> {company.eligibleDepartments.join(", ")}</p>
            <p><strong>Location:</strong> {company.location}</p>
            <p><strong>Deadline:</strong> {new Date(company.deadline).toLocaleDateString()}</p>

            <button className="btn" onClick={() => applyToCompany(company._id)}>
              Apply
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Companies;