import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

function EditTask({ task, onClose, onUpdate }) {
  const { user } = useContext(AuthContext);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
  });

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/user/task/${task._id}/update`,
        { title: editForm.title, description: editForm.description },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      onUpdate(task._id, response.data); // Pass task ID and updated data
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">Edit Task</h2>
        <input
          className="w-full p-2 border rounded mt-1"
          name="title"
          value={editForm.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <textarea
          className="w-full p-2 border rounded mt-2"
          name="description"
          value={editForm.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <div className="mt-4 flex justify-between">
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={saveEdit}>
            Save
          </button>
          <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTask;
