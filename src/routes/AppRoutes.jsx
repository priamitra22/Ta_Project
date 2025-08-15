import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages Auth
import LoginPage from "../pages/auth/LoginPage";

// Admin
import DashboardAdmin from "../pages/admin/DashboardAdmin";

// Guru
import DashboardGuru from "../pages/guru/DashboardGuru";

//Orang Tua
import DashboardOrangTua from "../pages/orangtua/DashboardOrangTua";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        </Route>

        {/* Guru */}
        <Route element={<GuruLayout />}>
          <Route path="/guru/dashboard" element={<DashboardGuru />} />
        </Route>

        {/* Admin */}
        <Route element={<OrangTuaLayout />}>
          <Route path="/orangtua/dashboard" element={<DashboardOrangTua />} />
        </Route>
      </Routes>
    </Router>
  );
}
