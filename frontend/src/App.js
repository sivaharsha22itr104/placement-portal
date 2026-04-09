import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Companies from "./pages/Companies";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="home-box card">
        <h1>Placement Portal</h1>
        <p>Welcome to the Placement Portal System</p>

        <div className="role-container">
          <div className="role-card" onClick={() => navigate("/login")}>
            <h2>👨‍🎓 Student</h2>
          </div>

          <div className="role-card" onClick={() => navigate("/admin-login")}>
            <h2>🧑‍💼 Admin</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/companies" element={<Companies />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;