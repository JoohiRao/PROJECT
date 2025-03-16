import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";


function ViewTask() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/tasks", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(response.data);
        updateGraph(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Update Graph Data
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

  // Change Task Status
  const changeStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/user/task/${taskId}/status`,
        { status: newStatus },
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

  // Edit Task
  const startEditing = (task) => {
    setEditingTask(task._id);
    setEditForm({ title: task.title, description: task.description });
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditForm({ title: "", description: "" });
  };

  const saveEdit = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/task/${taskId}`,
        { title: editForm.title, description: editForm.description },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, title: editForm.title, description: editForm.description } : task
      );

      setTasks(updatedTasks);
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
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
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Your Tasks</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-600">No tasks available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="p-4 bg-gray-100 shadow-md rounded-lg">
              {editingTask === task._id ? (
                // Edit Mode
                <div>
                  <input
                    className="w-full p-2 border rounded mt-1"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                  <textarea
                    className="w-full p-2 border rounded mt-2"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                  <div className="mt-2 flex justify-between">
                    <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => saveEdit(task._id)}>
                      Save
                    </button>
                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={cancelEditing}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <h2 className="text-xl font-semibold">{task.title}</h2>
                  <p className="mt-2">
                    <span className="font-medium">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}
                  </p>

                  {/* Toggle Description */}
                  <button
                    className="mt-2 text-blue-600 underline hover:text-blue-800"
                    onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                  >
                    {expandedTask === task._id ? "Hide Description" : "See Description"}
                  </button>

                  {expandedTask === task._id && (
                    <p className="mt-2 p-3 bg-white border rounded-lg shadow-inner">{task.description}</p>
                  )}

                  {/* Task Status Dropdown */}
                  <div className="mt-3">
                    <label className="block font-medium">Status:</label>
                    <select
                      className="w-full p-2 border rounded mt-1"
                      value={task.status}
                      onChange={(e) => changeStatus(task._id, e.target.value)}
                    >
                      <option value="not started">Not Started</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Edit & Delete Buttons */}
                  <div className="mt-3 flex justify-between">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => startEditing(task)}>
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteTask(task._id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Graph Section */}
      <div className="mt-10 p-6 bg-gray-100 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Task Status Distribution</h2>
        <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={["#ff6666", "#ffcc66", "#66cc66"][index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default ViewTask;
