import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import GuruLayout from "../layouts/GuruLayout";
import OrangTuaLayout from "../layouts/OrangTuaLayout";

// Pages Auth
import LoginPage from "../pages/auth/LoginPage";

// Pages Admin
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DataGuru from "../pages/admin/DataGuru";
import DataOrangTua from "../pages/admin/DataOrangTua";
import DataSiswa from "../pages/admin/DataSiswa";
import MataPelajaran from "../pages/admin/MataPelajaran";
import TahunAjaranSemester from "../pages/admin/TahunAjaranSemester";
import UnduhLaporan from "../pages/admin/UnduhLaporan";

// Pages Guru
import DashboardGuru from "../pages/guru/DashboardGuru";
import NilaiSiswa from "../pages/guru/NilaiSiswa";
import KehadiranSiswa from "../pages/guru/KehadiranSiswa";
import CatatanKhusus from "../pages/guru/CatatanKhusus";
import PesanGuru from "../pages/guru/PesanGuru";

// Pages Orang Tua
import DashboardOrangTua from "../pages/orangtua/DashboardOrangTua";
import PerkembanganAkademik from "../pages/orangtua/PerkembanganAkademik";
import RiwayatKehadiran from "../pages/orangtua/RiwayatKehadiran";
import CatatanKhususOT from "../pages/orangtua/CatatanKhususOT";
import PesanOrangTua from "../pages/orangtua/PesanOrangTua";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/data-guru" element={<DataGuru />} />
          <Route path="/admin/data-orang-tua" element={<DataOrangTua />} />
          <Route path="/admin/data-siswa" element={<DataSiswa />} />
          <Route path="/admin/mata-pelajaran" element={<MataPelajaran />} />
          <Route path="/admin/tahun-ajaran" element={<TahunAjaranSemester />} />
          <Route path="/admin/unduh-laporan" element={<UnduhLaporan />} />
        </Route>

        {/* Guru */}
        <Route element={<GuruLayout />}>
          <Route path="/guru/dashboard" element={<DashboardGuru />} />
          <Route path="/guru/nilai-siswa" element={<NilaiSiswa />} />
          <Route path="/guru/kehadiran" element={<KehadiranSiswa />} />
          <Route path="/guru/catatan-khusus" element={<CatatanKhusus />} />
          <Route path="/guru/pesan" element={<PesanGuru />} />
        </Route>

        {/* Orang Tua */}
        <Route element={<OrangTuaLayout />}>
          <Route path="/orangtua/dashboard" element={<DashboardOrangTua />} />
          <Route
            path="/orangtua/perkembangan"
            element={<PerkembanganAkademik />}
          />
          <Route
            path="/orangtua/riwayat-kehadiran"
            element={<RiwayatKehadiran />}
          />
          <Route
            path="/orangtua/catatan-khusus"
            element={<CatatanKhususOT />}
          />
          <Route path="/orangtua/pesan" element={<PesanOrangTua />} />
        </Route>
      </Routes>
    </Router>
  );
}
