import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaUserTie, 
  FaBook, 
  FaCalendar, 
  FaDownload, 
  FaUsers,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { NotificationProvider, NotificationContainer } from "../components/notifications";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    manajemenPengguna: false,
    akademik: false,
  });

  const handleLogout = () => {
    navigate("/"); // kembali ke login
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  return (
    <NotificationProvider>
      <div className="flex min-h-screen font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-[#F3F4F6] text-[#111827] flex flex-col justify-between shadow-lg">
          <div>
            {/* Logo + Nama Sekolah */}
            <div className="flex items-center gap-3 mb-4 p-4 bg-[#1E3A8A] text-white">
              <img
                src={logo}
                alt="Logo Sekolah"
                className="w-12 h-12 rounded-lg"
              />
              <h1 className="text-lg font-bold leading-tight">
                SDN 1 Langensari
              </h1>
            </div>

            {/* Menu */}
            <ul className="space-y-1 px-2">
              {/* Dashboard */}
              <li>
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === "/admin/dashboard"
                      ? "bg-[#1E3A8A] text-white font-semibold"
                      : "hover:bg-[#E5E7EB]"
                  }`}
                >
                  <FaUserTie /> Dashboard
                </Link>
              </li>

              {/* Manajemen Pengguna */}
              <li>
                <button
                  onClick={() => toggleMenu('manajemenPengguna')}
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-700 font-medium hover:bg-[#E5E7EB] rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FaUsers /> Manajemen Pengguna
                  </div>
                  {expandedMenus.manajemenPengguna ? (
                    <FaChevronDown className="w-4 h-4" />
                  ) : (
                    <FaChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedMenus.manajemenPengguna && (
                  <ul className="ml-6 space-y-1 mt-1">
                    <li>
                      <Link
                        to="/admin/akun-pengguna"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                          location.pathname === "/admin/akun-pengguna"
                            ? "bg-[#1E3A8A] text-white font-semibold"
                            : "hover:bg-[#E5E7EB]"
                        }`}
                      >
                        <FaUsers /> Akun Pengguna
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/data-guru"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                          location.pathname === "/admin/data-guru"
                            ? "bg-[#1E3A8A] text-white font-semibold"
                            : "hover:bg-[#E5E7EB]"
                        }`}
                      >
                        <FaUsers /> Data Guru
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/data-orang-tua"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                          location.pathname === "/admin/data-orang-tua"
                            ? "bg-[#1E3A8A] text-white font-semibold"
                            : "hover:bg-[#E5E7EB]"
                        }`}
                      >
                        <FaUsers /> Data Orang Tua
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/data-siswa"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                          location.pathname === "/admin/data-siswa"
                            ? "bg-[#1E3A8A] text-white font-semibold"
                            : "hover:bg-[#E5E7EB]"
                        }`}
                      >
                        <FaUsers /> Data Siswa
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Akademik */}
              <li>
                <button
                  onClick={() => toggleMenu('akademik')}
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-700 font-medium hover:bg-[#E5E7EB] rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FaBook /> Akademik
                  </div>
                  {expandedMenus.akademik ? (
                    <FaChevronDown className="w-4 h-4" />
                  ) : (
                    <FaChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedMenus.akademik && (
                  <ul className="ml-6 space-y-1 mt-1">
                    <li>
                      <Link
                        to="/admin/tahun-ajaran"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                          location.pathname === "/admin/tahun-ajaran"
                            ? "bg-[#1E3A8A] text-white font-semibold"
                            : "hover:bg-[#E5E7EB]"
                        }`}
                      >
                        <FaCalendar /> Tahun Ajaran
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/mata-pelajaran"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                          location.pathname === "/admin/mata-pelajaran"
                            ? "bg-[#1E3A8A] text-white font-semibold"
                            : "hover:bg-[#E5E7EB]"
                        }`}
                      >
                        <FaBook /> Mata Pelajaran
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>

          {/* Logout di bawah */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-black font-semibold py-2 rounded-md shadow transition-colors"
              style={{ backgroundColor: "#E5E7EB" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#FBBF24")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#E5E7EB")}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="flex items-center justify-end bg-[#1E3A8A] text-white p-4 shadow-md h-20">
            <div className="flex items-center gap-2 text-lg font-semibold">
              Selamat Datang, Admin <FaUserCircle size={24} />
            </div>
          </header>

          {/* Konten */}
          <main className="flex-1 p-6 bg-[#F9FAFB] text-[#111827]">
            <Outlet />
          </main>
        </div>

        {/* Notification Container */}
        <NotificationContainer />
      </div>
    </NotificationProvider>
  );
}
