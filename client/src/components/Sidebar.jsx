import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaTasks, FaUsers, FaTrash, FaCog, FaCalendarAlt, FaSignOutAlt, FaPlusCircle, FaEye, FaHome } from "react-icons/fa";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null; // Hide sidebar if not logged in

  const menuItems = user.role === "admin"
    ? [
        { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
        { name: "View Teams", path: "/view-teams", icon: <FaUsers /> },
        { name: "Create Teams", path: "/create-teams", icon: <FaPlusCircle /> },
        { name: "View Members", path: "/view-members", icon: <FaEye /> },
        { name: "Trash Teams", path: "/trash-teams", icon: <FaTrash /> },
        { name: "Settings", path: "/settings", icon: <FaCog /> },
      ]
    : [
        { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
        { name: "View Task", path: "/view-task", icon: <FaEye /> },
        { name: "Create Task", path: "/create-task", icon: <FaPlusCircle /> },
        { name: "View Teams", path: "/view-teams", icon: <FaUsers /> },
        { name: "Calendar", path: "/calendar", icon: <FaCalendarAlt /> },
      ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6 h-screen fixed shadow-lg">
      
      {/* User Info Section */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-white text-blue-600 flex items-center justify-center rounded-full text-xl font-bold">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm opacity-80">{user.role.toUpperCase()}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-3">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center space-x-3 w-full text-left py-3 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
            onClick={() => navigate(item.path)}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="absolute bottom-6 left-6 right-6 flex items-center justify-center bg-red-500 py-3 rounded-lg text-white font-semibold hover:bg-red-600 transition duration-300 w-full"
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </div>
  );
}

export default Sidebar;
