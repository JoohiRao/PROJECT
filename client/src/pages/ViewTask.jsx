import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import EditTask from "../components/EditTask";

function ViewTask() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [statusData, setStatusData] = useState([]);

  const COLORS = ["#FF4D4F", "#FFCC00", "#4CAF50"]; // Red, Yellow, Green

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/tasks", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const fetchedTasks = Array.isArray(response.data) ? response.data : [];
        setTasks(fetchedTasks);
        updateGraph(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTasks();
  }, [user]);

  // Update Graph Data for Task Statuses
  const updateGraph = (tasks) => {
    const statusCounts = { "Not Started": 0, "In Progress": 0, "Completed": 0 };

    tasks.forEach((task) => {
      const formattedStatus = task.status.toLowerCase();
      if (formattedStatus === "not started") statusCounts["Not Started"]++;
      if (formattedStatus === "in progress") statusCounts["In Progress"]++;
      if (formattedStatus === "completed") statusCounts["Completed"]++;
    });

    setStatusData([
      { name: "Not Started", value: statusCounts["Not Started"] },
      { name: "In Progress", value: statusCounts["In Progress"] },
      { name: "Completed", value: statusCounts["Completed"] },
    ]);
  };


  // Update Task Status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/user/task/${taskId}/status`,
        { status: newStatus.toLowerCase() },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      updateGraph(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Delete Task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/task/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      updateGraph(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-black text-gray-300 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#FFA500]">Your Tasks</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500 text-lg font-medium">No tasks available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="p-5 bg-[#2A2A2A] rounded-lg shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold mb-2 text-gray-200">{task.title}</h2>
              <p className="text-gray-400 mb-2">
                <span className="font-medium">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}
              </p>

              {/* Accordion for Description */}
              <button
                className="w-full text-left font-semibold text-[#FF8C00] hover:text-[#FFA500] mb-2"
                onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
              >
                {expandedTask === task._id ? "▼ Hide Description" : "► See Description"}
              </button>
              {expandedTask === task._id && (
                <p className="bg-gray-800 text-gray-300 p-3 rounded-lg">{task.description}</p>
              )}

              {/* Task Status */}
              <select
                className="w-full p-2 mt-2 bg-gray-900 border border-gray-600 rounded-lg text-gray-300"
                value={task.status.toLowerCase()}
                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
              >
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {/* Edit & Delete Buttons */}
              <div className="mt-4 flex justify-between">
                <button
                  className="bg-yellow-500 text-gray-800 px-4 py-1 rounded-lg hover:bg-yellow-600"
                  onClick={() => setEditTask(task)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Status Pie Chart */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Task Status Overview</h2>
        <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {editTask && (
        <EditTask task={editTask} onClose={() => setEditTask(null)} onUpdate={handleTaskUpdate} />
      )}
    </div>
  );
}

export default ViewTask;
