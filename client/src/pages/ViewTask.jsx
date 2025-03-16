import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

function ViewTask() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", priority: "", deadline: "" });

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/tasks", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(response.data);
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

  // Delete Task
  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/user/task/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task description visibility
  const toggleDescription = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  // Open Edit Modal
  const openEditModal = (task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline.split("T")[0], // Convert date for input field
    });
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setEditingTask(null);
  };

  // Handle form changes
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/user/task/${editingTask._id}/update`,
        editForm,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Update tasks in UI
      setTasks(tasks.map((task) => (task._id === editingTask._id ? response.data.task : task)));

      closeEditModal();
    } catch (error) {
      console.error("Error updating task:", error);
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
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="mt-2">
                <span className="font-medium">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}
              </p>

              {/* Toggle Description */}
              <button
                className="mt-2 text-blue-600 underline hover:text-blue-800"
                onClick={() => toggleDescription(task._id)}
              >
                {expandedTask === task._id ? "Hide Description" : "See Description"}
              </button>

              {/* Show description when expanded */}
              {expandedTask === task._id && (
                <p className="mt-2 p-3 bg-white border rounded-lg shadow-inner">{task.description}</p>
              )}

              <div className="mt-3 flex">
                {/* Edit Button */}
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
                  onClick={() => openEditModal(task)}
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Task</h2>

            <form onSubmit={handleEditSubmit}>
              <label className="block font-medium">Title:</label>
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                className="w-full p-2 border rounded mb-3"
                required
              />

              <label className="block font-medium">Description:</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                className="w-full p-2 border rounded mb-3"
                required
              />

              <label className="block font-medium">Priority:</label>
              <select
                name="priority"
                value={editForm.priority}
                onChange={handleEditChange}
                className="w-full p-2 border rounded mb-3"
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <label className="block font-medium">Deadline:</label>
              <input
                type="date"
                name="deadline"
                value={editForm.deadline}
                onChange={handleEditChange}
                className="w-full p-2 border rounded mb-3"
                required
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>

                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTask;
