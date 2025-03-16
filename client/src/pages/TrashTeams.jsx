import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TrashTeams() {
  const [trashTeams, setTrashTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrashTeams();
  }, []);

  const fetchTrashTeams = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) {
        console.error("No token found! User may not be authenticated.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get("http://localhost:5000/api/team/trash", config);

      setTrashTeams(res.data);
    } catch (error) {
      console.error("Error fetching trashed teams:", error.response?.data?.message || error.message);
    }
  };

  // Function to permanently delete a team
  const handleDelete = async (teamId) => {
    if (!window.confirm("Are you sure you want to permanently delete this team?")) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) {
        console.error("No token found! User may not be authenticated.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/team/${teamId}/delete`, config);

      setTrashTeams(trashTeams.filter((team) => team._id !== teamId));
      alert("Team permanently deleted.");
    } catch (error) {
      console.error("Error deleting team:", error.response?.data?.message || error.message);
    }
  };

  // Function to restore a team
  const handleRestore = async (teamId) => {
    console.log("Restoring team:", teamId); // Debugging
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) {
        console.error("No token found! User may not be authenticated.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/team/${teamId}/restore`, {}, config);

      setTrashTeams(trashTeams.filter((team) => team._id !== teamId));
      alert("Team restored successfully.");
    } catch (error) {
      console.error("Error restoring team:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Trash Teams</h1>

      {trashTeams.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {trashTeams.map((team) => (
            <div key={team._id} className="p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{team.name}</h2>
              <p className="text-gray-600 mt-2">{team.description || "No description available"}</p>
              <p className="mt-2">
                <strong>Priority:</strong>{" "}
                <span className="px-2 py-1 rounded bg-gray-400 text-white">{team.priority || "Not Assigned"}</span>
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleRestore(team._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Restore
                </button>
                <button
                  onClick={() => handleDelete(team._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No deleted teams found.</p>
      )}

      <div className="mt-6">
        <button onClick={() => navigate("/view-teams")} className="bg-gray-700 text-white px-4 py-2 rounded">
          Back to Teams
        </button>
      </div>
    </div>
  );
}

export default TrashTeams;
