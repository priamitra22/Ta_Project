import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Pages Trial
import StatCardTrial from "../pages/trial/StatCardTrial";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import GuruLayout from "../layouts/GuruLayout";
import OrangTuaLayout from "../layouts/OrangTuaLayout";

// Pages Auth
import LoginPage from "../pages/auth/LoginPage";

// Admin
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import AkunPengguna from "../pages/admin/akun-pengguna/AkunPenggunaPage";
import DataGuru from "../pages/admin/data-guru/DataGuruPage";
import DataOrangTua from "../pages/admin/data-orangtua/DataOrangtuaPage";
import DataSiswa from "../pages/admin/data-siswa/DataSiswaPage";
import TahunAjaranSemester from "../pages/admin/tahun-ajaran-semester/TahunAjaranSemesterPage";
import MataPelajaran from "../pages/admin/mata-pelajaran/MataPelajaranPage";

// Guru
import DashboardGuru from "../pages/guru/DashboardGuru";
import NilaiSiswa from "../pages/guru/nilai-siswa/NilaiSiswaPage";
import KehadiranSiswa from "../pages/guru/kehadiran-siswa/KehadiranSiswa";    
import CatatanKhususPage from "../pages/guru/catatan-khusus/CatatanKhususPage";
import PesanPage from "../pages/guru/pesan/PesanPage";

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
          <Route path="/admin/akun-pengguna" element={<AkunPengguna />} />
          <Route path="/admin/data-guru" element={<DataGuru />} />
          <Route path="/admin/data-orangtua" element={<DataOrangTua />} />
          <Route path="/admin/data-siswa" element={<DataSiswa />} />
          <Route path="/admin/tahun-ajaran-semester" element={<TahunAjaranSemester />} />
          <Route path="/admin/mata-pelajaran" element={<MataPelajaran />} />
        </Route>

        {/* Trial */}
        <Route path="/trial/stat-card" element={<StatCardTrial />} />

        {/* Guru */}
        <Route element={<GuruLayout />}>
          <Route path="/guru/dashboard" element={<DashboardGuru />} />
          <Route path="/guru/nilai-siswa" element={<NilaiSiswa />} />
          <Route path="/guru/kehadiran" element={<KehadiranSiswa />} />
          <Route path="/guru/catatan-khusus" element={<CatatanKhususPage />} />
          <Route path="/guru/pesan" element={<PesanPage />} />
        </Route>

        {/* Admin */}
        <Route element={<OrangTuaLayout />}>
          <Route path="/orangtua/dashboard" element={<DashboardOrangTua />} />
        </Route>
      </Routes>
    </Router>
  );
}
