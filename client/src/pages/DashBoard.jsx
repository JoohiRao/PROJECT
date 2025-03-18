import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaTasks,
  FaCheckCircle,
  FaSpinner,
  FaTimesCircle,
  FaChartPie,
  FaCheck,
  FaExclamationTriangle,
  FaExclamationCircle,
} from "react-icons/fa";
import { FiBarChart2 } from "react-icons/fi";
import AuthContext from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [priorityChartData, setPriorityChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  });

  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") {
      navigate("/admin-dashboard");
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/tasks", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const fetchedTasks = Array.isArray(response.data) ? response.data : [];
        setTasks(fetchedTasks);

        setTaskStats({
          total: fetchedTasks.length,
          completed: fetchedTasks.filter((t) => t.status.toLowerCase() === "completed").length,
          inProgress: fetchedTasks.filter((t) => t.status.toLowerCase() === "in progress").length,
          notStarted: fetchedTasks.filter((t) => t.status.toLowerCase() === "not started").length,
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [location, user]);

  useEffect(() => {
    if (!user) return;

    const fetchPriorityGraph = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/graph/task-priority", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setPriorityChartData([
          { name: "High", value: response.data.High, color: "#FF4D4F" },
          { name: "Medium", value: response.data.Medium, color: "#FFCC00" },
          { name: "Low", value: response.data.Low, color: "#4CAF50" },
        ]);
      } catch (error) {
        console.error("Error fetching priority graph:", error);
      }
    };

    fetchPriorityGraph();
  }, [user]);

  const getPriorityStyles = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return { color: "#FF4D4F", label: "High", icon: <FaExclamationCircle /> };
      case "medium":
        return { color: "#FFCC00", label: "Medium", icon: <FaExclamationTriangle /> };
      case "low":
        return { color: "#4CAF50", label: "Low", icon: <FaCheck /> };
      default:
        return { color: "#808080", label: "Unknown", icon: <FaTasks /> };
    }
  };

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return { color: "#4CAF50", label: "COMPLETED" };
      case "in progress":
        return { color: "#FFCC00", label: "IN PROGRESS" };
      case "not started":
        return { color: "#FF4D4F", label: "NOT STARTED" };
      default:
        return { color: "#808080", label: "UNKNOWN" };
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-4 p-6 bg-[#181818] text-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
        Welcome, {user?.name} 👋
      </h1>

      {/* Task Overview & Priority Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Task Overview */}
        <div className="bg-[#2a2a2a] p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaTasks /> Task Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-500 rounded-lg text-center">
              Total <p className="text-2xl font-bold">{taskStats.total}</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg text-center">
              <FaCheckCircle /> Completed
              <p className="text-2xl font-bold">{taskStats.completed}</p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg text-center">
              <FaSpinner /> In Progress
              <p className="text-2xl font-bold">{taskStats.inProgress}</p>
            </div>
            <div className="p-3 bg-red-500 rounded-lg text-center">
              <FaTimesCircle /> Not Started
              <p className="text-2xl font-bold">{taskStats.notStarted}</p>
            </div>
          </div>
        </div>

        {/* Priority Pie Chart */}
        <div className="bg-[#2a2a2a] p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaChartPie /> Task Priority
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={priorityChartData} dataKey="value" outerRadius={80}>
                {priorityChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4">
    <h3 className="text-lg font-semibold mb-2">Priority Legend:</h3>
    <ul className="flex gap-4">
      <li className="flex items-center gap-2">
        <span className="w-4 h-4 bg-[#FF4D4F] block rounded-full"></span> 
        <span>High Priority (Red)</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="w-4 h-4 bg-[#FFCC00] block rounded-full"></span> 
        <span>Medium Priority (Yellow)</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="w-4 h-4 bg-[#4CAF50] block rounded-full"></span> 
        <span>Low Priority (Green)</span>
      </li>
    </ul>
  </div>
        </div>

        
      </div>

      {/* Task Status Bar Chart */}
      <div className="bg-[#2a2a2a] p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiBarChart2 /> Task Status Graph
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={[
              { name: "Completed", value: taskStats.completed },
              { name: "In Progress", value: taskStats.inProgress },
              { name: "Not Started", value: taskStats.notStarted },
            ]}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {tasks.slice(0, 4).map((task) => {
              const { color, label, icon } = getPriorityStyles(task.priority);
              const { color: statusColor, label: statusLabel } = getStatusStyles(task.status);

              return (
                <div key={task._id} className="bg-[#2a2a2a] p-4 rounded-lg shadow-lg relative">
                  <h3 className="text-xl font-bold mb-2">{task.title}</h3>

                  <div className="absolute top-2 right-2 text-right">
                    <p style={{ color }}>
                      <strong>Priority:</strong> {label} {icon}
                    </p>
                    <p>
                      <strong>Deadline:</strong>{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="mt-8" style={{ color: statusColor }}>
                    <strong>Status:</strong> {statusLabel}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate("/view-task")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mx-auto block transition duration-200"
          >
            Show More
          </button>
        </>
      )}

    </div>




    
  );
}

export default Dashboard;
