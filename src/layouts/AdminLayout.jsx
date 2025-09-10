import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaUserTie, 
  FaBook, 
  FaCalendar, 
  FaGraduationCap,
  FaDownload, 
  FaUsers,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
  FaChevronRight,
  FaBars,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import ToastContainer from "../components/ToastContainer";
import { getProfile } from "../services/authService";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    manajemenPengguna: false,
    akademik: false,
  });
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    navigate("/"); // kembali ke login
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await getProfile();
        if (response.success) {
          setUserProfile(response.data);
        } else {
          console.error("Failed to fetch profile:", response.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="drawer lg:drawer-open">
        {/* Drawer Toggle */}
        <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

        {/* Main Content */}
        <div className="drawer-content flex flex-col">
                  {/* Topbar */}
        <header className="sticky top-0 z-50 flex items-center justify-between bg-[#1E3A8A] text-white p-4 shadow-md h-20">
            {/* Hamburger di mobile */}
            <label htmlFor="sidebar-drawer" className="btn btn-ghost lg:hidden">
              <FaBars size={22} />
            </label>

            <div className="flex-1 flex justify-end items-center gap-2 text-lg font-semibold">
              Selamat Datang, {loading ? "Loading..." : (userProfile?.nama || "Admin")} <FaUserCircle size={22} />
            </div>
          </header>

                  {/* Konten */}
        <main className="flex-1 p-4 pt-6 mt-2 bg-[#F9FAFB] text-[#111827]">
            <Outlet />
          </main>
        </div>

        {/* Sidebar */}
        <div className="drawer-side">
          <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
          <aside className="w-64 bg-[#F3F4F6] flex flex-col justify-between min-h-screen">
            <div>
              {/* Logo */}
              <div className="flex items-center gap-3 p-4 bg-[#1E3A8A] text-white">
                <img src={logo} alt="Logo Sekolah" className="w-12 h-12 rounded-lg" />
                <h1 className="text-lg font-bold leading-tight">SDN 1 Langensari</h1>
              </div>

              {/* Menu */}
              <ul className="menu p-2 text-[#111827]">
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
                          to="/admin/data-orangtua"
                          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                            location.pathname === "/admin/data-orangtua"
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
                          to="/admin/tahun-ajaran-semester"
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
                          to="/admin/manajemen-akademik-kelas"
                          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                            location.pathname === "/admin/manajemen-akademik-kelas"
                              ? "bg-[#1E3A8A] text-white font-semibold"
                              : "hover:bg-[#E5E7EB]"
                          }`}
                        >
                          <FaGraduationCap /> Manajemen Akademik Kelas
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>

            {/* Logout */}
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-black font-semibold py-2 rounded shadow transition-colors"
                style={{ backgroundColor: "#FBBF24" }}
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </aside>
        </div>

        {/* Toast Container */}
        <ToastContainer />
      </div>
  );
}
