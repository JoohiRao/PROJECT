import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import EditTask from "../components/EditTask";

function ViewTask() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [editTask, setEditTask] = useState(null);

  const COLORS = ["#FF5733", "#FFC300", "#4CAF50"];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/tasks", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (Array.isArray(response.data)) {
          setTasks(response.data);
          updateGraph(response.data);
        } else {
          console.error("Invalid response format:", response.data);
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

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

  const handleTaskUpdate = (taskId, updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
    updateGraph(updatedTasks);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const formattedStatus = newStatus.toLowerCase();

      const response = await axios.patch(
        `http://localhost:5000/api/user/task/${taskId}/status`,
        { status: formattedStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (response.data.task) {
        const updatedTasks = tasks.map((task) =>
          task._id === taskId ? { ...task, status: formattedStatus } : task
        );
        setTasks(updatedTasks);
        updateGraph(updatedTasks);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  useEffect(() => {
    updateGraph(tasks);
  }, [tasks]);

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
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Your Tasks</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-600 text-lg font-medium">No tasks available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="p-4 bg-gray-100 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="mt-2">
                <span className="font-medium">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}
              </p>

              <button
                className="mt-2 text-blue-600 underline hover:text-blue-800"
                onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
              >
                {expandedTask === task._id ? "Hide Description" : "See Description"}
              </button>

              {expandedTask === task._id && (
                <p className="mt-2 p-3 bg-white border rounded-lg shadow-inner">{task.description}</p>
              )}

              {/* Status Selection Dropdown */}
              <div className="mt-3">
                <label className="block font-medium text-gray-700">Status:</label>
                <select
                  className="w-full p-2 mt-1 border rounded-lg"
                  value={task.status.toLowerCase()} 
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                >
                  <option value="not started">Not Started</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mt-3 flex justify-between">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => setEditTask(task)}>
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Status Graph */}
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
