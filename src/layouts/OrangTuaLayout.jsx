import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaFileAlt,
  FaComments,
  FaSignOutAlt,
  FaUserCircle,
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

  return (
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
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.to
                      ? "bg-[#1E3A8A] text-white font-semibold"
                      : "hover:bg-[#E5E7EB]"
                  }`}
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
            className="w-full flex items-center justify-center gap-2 text-black font-semibold py-2 rounded-md shadow transition-colors"
            style={{ backgroundColor: "#E5E7EB" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#FBBF24")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#E5E7EB")}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-end bg-[#1E3A8A] text-white p-4 shadow-md h-20">
          <div className="flex items-center gap-2 text-lg font-semibold">
            Selamat Datang, Orang Tua <FaUserCircle size={24} />
          </div>
        </header>

        {/* Konten */}
        <main className="flex-1 p-6 bg-[#F9FAFB] text-[#111827]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
