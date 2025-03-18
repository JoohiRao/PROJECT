import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

function CreateTask() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/user/task", task, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate("/dashboard", { state: { refresh: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-3xl p-8 bg-[#1a1a1a] text-gray-300 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">
          Create New Task
        </h2>
        {error && <p className="text-red-500 mb-4 font-semibold">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-400 font-medium mb-2">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
              className="w-full px-4 py-2 bg-[#333333] border border-gray-500 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-400 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              required
              placeholder="Enter task description"
              className="w-full px-4 py-2 bg-[#333333] border border-gray-500 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            ></textarea>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-gray-400 font-medium mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#333333] border border-gray-500 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-gray-400 font-medium mb-2">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={task.deadline}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#333333] border border-gray-500 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;