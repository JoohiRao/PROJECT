import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { FiHome, FiUsers, FiTrash2, FiSettings, FiCalendar, FiLogOut, FiPlusSquare, FiClipboard } from "react-icons/fi";

function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null; // Prevent rendering before redirect

  // 🟢 Define sidebar items based on role
  const menuItems = user.role === "admin"
    ? [
        { name: "Dashboard", path: "/admindashboard", icon: <FiHome /> },
        { name: "View Teams", path: "/adminview-teams", icon: <FiUsers /> },
        { name: "Create Teams", path: "/create-teams", icon: <FiPlusSquare /> },
        { name: "View Members", path: "/view-members", icon: <FiClipboard /> },
        { name: "Trash Teams", path: "/trash-teams", icon: <FiTrash2 /> },
        { name: "Settings", path: "/settings", icon: <FiSettings /> },
      ]
    : [
        { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
        { name: "View Task", path: "/view-task", icon: <FiClipboard /> },
        { name: "Create Task", path: "/create-task", icon: <FiPlusSquare /> },
        { name: "View Teams", path: "/view-teams", icon: <FiUsers /> },
        { name: "Calendar", path: "/calendar", icon: <FiCalendar /> },
      ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Fixed for all pages) */}
      <div className="w-64 bg-[#181818] text-white p-6 flex flex-col fixed h-full shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center mb-18">
          <img
            src="/logo.png"
            alt="TaskHive Logo"
            className="w-32 h-24 mb-4"
          />
        </div>
       

        {/* Role-based Sidebar Navigation */}
        <nav className="flex-grow space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center w-full text-left py-2 px-4 rounded-lg hover:bg-[#333333] transition duration-300 transform hover:scale-105 animate-slide-in"
              onClick={() => navigate(item.path)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex items-center justify-center bg-red-500 py-2 mt-4 rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105 animate-fade-in"
        >
          <FiLogOut className="mr-2" />
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 p-6 bg-gray-100">
        <Outlet /> {/* Loads respective page based on route */}
      </div>
    </div>
  );
}

export default Layout;
