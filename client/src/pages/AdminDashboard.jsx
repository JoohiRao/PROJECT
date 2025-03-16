import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [taskAssignmentData, setTaskAssignmentData] = useState([]);
  const [taskProgressData, setTaskProgressData] = useState([]);
  const [refreshGraph, setRefreshGraph] = useState(false); // ⬅ Force graph update

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    if (!token) {
      console.error("No token found! User may not be authenticated.");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch Teams
    axios.get("http://localhost:5000/api/team", config)
      .then((res) => setTeams(res.data))
      .catch((err) => console.error("Error fetching teams:", err));

    // Fetch Task Assignment Graph
    axios.get("http://localhost:5000/api/admin/task-assignment-graph", config)
      .then((res) => setTaskAssignmentData(res.data))
      .catch((err) => console.error("Error fetching task assignment data:", err));

    // Fetch Task Progress Graph (Triggered on update)
    fetchTaskProgressGraph(config);

  }, [refreshGraph]); // ⬅ Re-fetch when `refreshGraph` changes

  const fetchTaskProgressGraph = async (config) => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/task-progress-graph", config);
      setTaskProgressData(res.data);
    } catch (err) {
      console.error("Error fetching task progress data:", err);
    }
  };

  // 🎨 Colors for Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // ⬅ Function to refresh graph after task status change
  const handleTaskUpdate = async () => {
    setRefreshGraph((prev) => !prev);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Hi, {user && user.role === "admin" ? user.name : "Admin"}
      </h1>

      {/* 📊 Task Assignment Graph */}
      <h2 className="text-lg font-semibold mt-4">Task Assignment Per Day</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={taskAssignmentData}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      {/* 📈 Task Progress Overview */}
      <h2 className="text-lg font-semibold mt-6">Task Progress Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={taskProgressData}
      dataKey="count"
      nameKey="_id"
      cx="50%"
      cy="50%"
      outerRadius={100}
      fill="#8884d8"
      label
    >
      {taskProgressData.map((entry, index) => (
        <Cell key={entry._id} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>


      {/* 📌 Teams Section */}
      <h2 className="text-lg font-semibold mt-6">Teams</h2>
      {teams.length ? (
        <ul className="mt-2">
          {teams.slice(0, 4).map((team) => (
            <li key={team._id} className="border p-3 rounded-lg mb-2">
              <strong>{team.name}</strong> - {team.members.length} members
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2">No teams available.</p>
      )}

      {/* Show More Button */}
      {teams.length > 4 && (
        <button
          onClick={() => navigate("/view-teams")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Show More
        </button>
      )}

      {/* 🔄 Button to Manually Refresh Graph */}
      <button
        onClick={handleTaskUpdate}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
      >
        Refresh Graph
      </button>
    </div>
  );
}

export default AdminDashboard;
