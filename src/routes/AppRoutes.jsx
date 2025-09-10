import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";



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
import DataOrangTua from "../pages/admin/data-orangtua/DataOrangTuaPage";
import DataSiswa from "../pages/admin/data-siswa/DataSiswaPage";
import TahunAjaranSemester from "../pages/admin/tahun-ajaran-semester/TahunAjaranSemesterPage";
import ManajemenAkademikKelas from "../pages/admin/manajemen-akademik-kelas/ManajemenAkademikKelasPage";

// Guru
import DashboardGuru from "../pages/guru/DashboardGuru";
import NilaiSiswa from "../pages/guru/nilai-siswa/NilaiSiswaPage";
import KehadiranSiswa from "../pages/guru/kehadiran-siswa/KehadiranSiswa";    
import CatatanKhususPage from "../pages/guru/catatan-khusus/CatatanKhususPage";
import PesanPage from "../pages/guru/pesan/PesanPage";

//Orang Tua
import DashboardOrangTua from "../pages/orangtua/DashboardOrangTua";
import NilaiSiswaOrangTua from "../pages/orangtua/nilai-siswa/NilaiSiswaOrangTuaPage";
import KehadiranSiswaOrangTua from "../pages/orangtua/kehadiran-siswa/KehadiranSiswaOrangTuaPage";    
import CatatanKhususOrangTua from "../pages/orangtua/catatan-khusus/CatatanKhususOrangTuaPage";
import PesanOrangTua from "../pages/orangtua/pesan/PesanOrangTuaPage";

// 🔹 PrivateRoute untuk proteksi berdasarkan role + token
const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/akun-pengguna" element={<AkunPengguna />} />
          <Route path="/admin/data-guru" element={<DataGuru />} />
          <Route path="/admin/data-orangtua" element={<DataOrangTua />} />
          <Route path="/admin/data-siswa" element={<DataSiswa />} />
          <Route path="/admin/tahun-ajaran-semester" element={<TahunAjaranSemester />} />
          <Route path="/admin/manajemen-akademik-kelas" element={<ManajemenAkademikKelas />} />
        </Route>


         {/* Guru */}
         <Route
          path="/guru"
          element={
            <PrivateRoute role="guru">
              <GuruLayout />
            </PrivateRoute>
          }
        >
          <Route path="/guru/dashboard" element={<DashboardGuru />} />
          <Route path="/guru/nilai-siswa" element={<NilaiSiswa />} />
          <Route path="/guru/kehadiran" element={<KehadiranSiswa />} />
          <Route path="/guru/catatan-khusus" element={<CatatanKhususPage />} />
          <Route path="/guru/pesan" element={<PesanPage />} />
        </Route>

        {/* Orangtua */}
        <Route
          path="/orangtua"
          element={
            <PrivateRoute role="orangtua">
              <OrangTuaLayout />
            </PrivateRoute>
          }
        >
          <Route path="/orangtua/dashboard" element={<DashboardOrangTua />} />
          <Route path="/orangtua/perkembangan" element={<NilaiSiswaOrangTua />} />
          <Route path="/orangtua/riwayat-kehadiran" element={<KehadiranSiswaOrangTua />} />
          <Route path="/orangtua/catatan-khusus" element={<CatatanKhususOrangTua />} />
          <Route path="/orangtua/pesan" element={<PesanOrangTua />} />
        </Route>
      </Routes>
    </Router>
  );
}
