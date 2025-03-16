import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewTeams() {
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editedData, setEditedData] = useState({ name: "", description: "", priority: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) {
        console.error("No token found! User may not be authenticated.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get("http://localhost:5000/api/team", config);
      setTeams(res.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleDelete = async (teamId) => {
    console.log("Deleting team with ID:", teamId); // Debugging line
  
    const token = localStorage.getItem("token"); // Get token from local storage
    if (!token) {
      alert("No token found, please log in again.");
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:5000/api/team/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Add token to headers
        }
      });
  
      console.log("Delete response:", response.data);
      alert("Team deleted successfully!");
      fetchTeams(); // Refresh the team list after deletion
    } catch (error) {
      console.error("Error deleting team:", error.response?.data?.message || error.message);
      alert("Error deleting team: " + (error.response?.data?.message || "Unknown error"));
    }
  };
  
  

  const handleEdit = (team) => {
    setEditingTeam(team._id);
    setEditedData({ name: team.name, description: team.description, priority: team.priority });
  };

  const handleSaveEdit = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`http://localhost:5000/api/team/${editingTeam}`, editedData, config);
      setEditingTeam(null);
      fetchTeams();
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Teams</h1>

      {teams.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {teams.map((team) => (
            <div key={team._id} className="p-4 border rounded-lg shadow-md">
              {editingTeam === team._id ? (
                <div>
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    className="border p-2 rounded w-full mb-2"
                  />
                  <textarea
                    value={editedData.description}
                    onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                    className="border p-2 rounded w-full mb-2"
                  />
                  <select
                    value={editedData.priority}
                    onChange={(e) => setEditedData({ ...editedData, priority: e.target.value })}
                    className="border p-2 rounded w-full mb-2"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <button onClick={handleSaveEdit} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                  <button onClick={() => setEditingTeam(null)} className="ml-2 bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{team.name}</h2>
                  <p className="text-gray-600 mt-2">{team.description || "No description available"}</p>
                  <p className="mt-2">
                    <strong>Priority:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded ${
                        team.priority === "High"
                          ? "bg-red-500 text-white"
                          : team.priority === "Medium"
                          ? "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {team.priority || "Not Assigned"}
                    </span>
                  </p>
                  <div className="mt-3">
                    <button onClick={() => handleEdit(team)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(team._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No teams available.</p>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate("/trash-teams")}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          View Trash Teams
        </button>
      </div>
    </div>
  );
}

export default ViewTeams;
