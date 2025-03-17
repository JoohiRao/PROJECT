import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
        const response = await axios.get(
          "http://localhost:5000/api/user/tasks",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        console.log("Fetched tasks:", response.data);
        const fetchedTasks = Array.isArray(response.data) ? response.data : [];
        setTasks(fetchedTasks);

        // Calculate task statistics
        const completed = fetchedTasks.filter(
          (task) => task.status.toLowerCase() === "completed"
        ).length;
        const inProgress = fetchedTasks.filter(
          (task) => task.status.toLowerCase() === "in progress"
        ).length;
        const notStarted = fetchedTasks.filter(
          (task) => task.status.toLowerCase() === "not started"
        ).length;

        setTaskStats({
          total: fetchedTasks.length,
          completed,
          inProgress,
          notStarted,
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
        setTaskStats({ total: 0, completed: 0, inProgress: 0, notStarted: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [location.state, user]);

  useEffect(() => {
    if (!user) return;

    const fetchPriorityGraph = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/graph/task-priority",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        console.log("Fetched Priority Graph:", response.data);

        setPriorityChartData([
          { name: "High Priority", value: response.data.High, color: "#F44336" },
          { name: "Medium Priority", value: response.data.Medium, color: "#FFC107" },
          { name: "Low Priority", value: response.data.Low, color: "#4CAF50" },
        ]);
      } catch (error) {
        console.error("Error fetching priority graph:", error);
      }
    };

    fetchPriorityGraph();
  }, [user]);

  // Get priority color for task labels
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-400 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Welcome Message */}
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Welcome, {user?.name}
      </h1>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Task Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-100 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-700">Total Tasks</h3>
              <p className="text-2xl font-bold">{taskStats.total}</p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
              <p className="text-2xl font-bold">{taskStats.completed}</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
              <p className="text-2xl font-bold">{taskStats.inProgress}</p>
            </div>
            <div className="p-4 bg-red-100 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-700">Not Started</h3>
              <p className="text-2xl font-bold">{taskStats.notStarted}</p>
            </div>
          </div>
        </div>

        {/* Task Status Graph */}
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Task Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: "Completed", value: taskStats.completed, color: "#4CAF50" },
                { name: "In Progress", value: taskStats.inProgress, color: "#FFC107" },
                { name: "Not Started", value: taskStats.notStarted, color: "#F44336" },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Priority Graph */}
      <div className="p-4 bg-gray-100 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Task Priority</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={priorityChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Task List (Max 4 tasks) */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Your Tasks</h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-600">No tasks available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.slice(0, 4).map((task) => (
            <div key={task._id} className="p-4 bg-gray-100 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-700 mt-2">{task.description}</p>
              <p className="mt-2">
                <span className="font-medium">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}
              </p>
              <span className={`inline-block px-3 py-1 mt-3 rounded-full text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Show More Button */}
      {tasks.length > 4 && (
        <div className="mt-6 text-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() => navigate("/view-task")}
          >
            Show More
          </button>
        </div>
      )}



    </div>
  );
}

export default Dashboard;
