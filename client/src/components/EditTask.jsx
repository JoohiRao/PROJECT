import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

function EditTask() {
  const { user } = useContext(AuthContext);
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "low",
    deadline: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch Task Details
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/task/${taskId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, user.token]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(
        `http://localhost:5000/api/user/task/${taskId}/update`,
        task,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert("Task updated successfully!");
      navigate("/view-task"); // Redirect to task list
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit Task</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading task details...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-medium">Priority</label>
            <select
              className="w-full p-2 border rounded"
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Deadline</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={task.deadline.split("T")[0]}
              onChange={(e) => setTask({ ...task, deadline: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="w-full p-3 bg-green-500 text-white rounded">
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}

export default EditTask;
