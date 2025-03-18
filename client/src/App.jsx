import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard"


import ViewTask from "./pages/ViewTask";
import CreateTask from "./pages/CreateTask";
import ViewTeams from "./pages/ViewTeams";
import Calendars from "./pages/Calendars";
import CreateTeams from "./pages/CreateTeams";
import ViewMembers from "./pages/ViewMembers";
import TrashTeams from "./pages/TrashTeams";
import Settings from "./pages/Settings";
import AdminViewTeams from "./pages/AdminViewTeams";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider> {/* ✅ Wrap everything inside AuthProvider */}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes (With Sidebar & Logout) */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/view-task" element={<ViewTask />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/view-teams" element={<ViewTeams />} />
            <Route path="/calendar" element={<Calendars />} />

            {/* Admin Routes */}
            <Route path="/admindashboard" element={<AdminDashboard/>}/>
            <Route path="/adminview-teams" element={<AdminViewTeams />} />
            <Route path="/create-teams" element={<CreateTeams />} />
            <Route path="/view-members" element={<ViewMembers />} />
            <Route path="/trash-teams" element={<TrashTeams />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Redirect if no match */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
