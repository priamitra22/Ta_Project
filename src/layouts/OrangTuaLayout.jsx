import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaFileAlt,
  FaComments,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";
import logo from "../assets/logo.png";

export default function OrangTuaLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    { to: "/orangtua/dashboard", icon: <FaHome />, label: "Dashboard" },
    {
      to: "/orangtua/perkembangan",
      icon: <FaChartLine />,
      label: "Perkembangan Akademik",
    },
    {
      to: "/orangtua/riwayat-kehadiran",
      icon: <FaFileAlt />,
      label: "Riwayat Kehadiran",
    },
    {
      to: "/orangtua/catatan-khusus",
      icon: <FaFileAlt />,
      label: "Catatan Khusus",
    },
    { to: "/orangtua/pesan", icon: <FaComments />, label: "Pesan" },
  ];

  const isActive = (path) =>
    location.pathname === path
      ? "bg-[#1E3A8A] text-white font-semibold"
      : "hover:bg-[#E5E7EB]";

  return (
    <div className="drawer lg:drawer-open">
      {/* Drawer toggle */}
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-50 flex items-center justify-between bg-[#1E3A8A] text-white p-4 shadow-md h-20">
          {/* Hamburger (muncul di mobile) */}
          <label htmlFor="sidebar-drawer" className="btn btn-ghost lg:hidden">
            <FaBars size={22} />
          </label>

          <div className="flex-1 flex justify-end items-center gap-2 text-lg font-semibold">
            Selamat Datang, Orang Tua <FaUserCircle size={22} />
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
            <ul className="menu p-2 text-[#111827]">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive(item.to)}`}
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              ))}
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
    </div>
  );
}
