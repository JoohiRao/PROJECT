import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    if (user.role === "admin") {
      navigate("/admindashboard");
      return;
    }
    
  }, [user, navigate]);

  if (!user) return null; // Prevent rendering before redirect

  // 🟢 Define sidebar items based on role
  const menuItems = user.role === "admin"
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "View Teams", path: "/view-teams" },
        { name: "Create Teams", path: "/create-teams" },
        { name: "View Members", path: "/view-members" },
        { name: "Trash Teams", path: "/trash-teams" },
        { name: "Settings", path: "/settings" },
      ]
    : [
        { name: "Dashboard", path: "/dashboard" },
        { name: "View Task", path: "/view-task" },
        { name: "Create Task", path: "/create-task" },
        { name: "View Teams", path: "/view-teams" },
        { name: "Calendar", path: "/calendar" },
      ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Fixed for all pages) */}
      <div className="w-64 bg-blue-600 text-white p-6 flex flex-col fixed h-full">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {/* Role-based Sidebar Navigation */}
        <nav className="flex-grow">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="block w-full text-left py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-200"
              onClick={() => navigate(item.path)}
            >
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
          className="bg-red-500 py-2 rounded-lg text-center hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 p-6">
        <Outlet /> {/* Loads respective page based on route */}
      </div>
    </div>
  );
}

export default Layout;
