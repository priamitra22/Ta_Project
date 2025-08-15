import { Outlet, Link } from "react-router-dom";
import {
  FaUserTie,
  FaBook,
  FaCalendar,
  FaDownload,
  FaUsers,
} from "react-icons/fa";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 p-4">
        <h1 className="text-xl font-bold mb-6">SDN 1 Langensari</h1>
        <ul className="menu">
          <li>
            <Link to="/admin/dashboard">
              <FaUserTie /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/data-guru">
              <FaUsers /> Data Guru
            </Link>
          </li>
          <li>
            <Link to="/admin/data-orang-tua">
              <FaUsers /> Data Orang Tua
            </Link>
          </li>
          <li>
            <Link to="/admin/data-siswa">
              <FaUsers /> Data Siswa
            </Link>
          </li>
          <li>
            <Link to="/admin/mata-pelajaran">
              <FaBook /> Mata Pelajaran
            </Link>
          </li>
          <li>
            <Link to="/admin/tahun-ajaran">
              <FaCalendar /> Tahun Ajaran
            </Link>
          </li>
          <li>
            <Link to="/admin/unduh-laporan">
              <FaDownload /> Unduh Laporan
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
