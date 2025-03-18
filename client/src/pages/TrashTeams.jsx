import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TrashTeams() {
  const [trashedTeams, setTrashedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    fetchTrashedTeams();
  }, []);

  const fetchTrashedTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/team/trashed-teams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrashedTeams(response.data.trashedTeams);
    } catch (error) {
      console.error("Error fetching trashed teams:", error);
      setError("Failed to fetch trashed teams.");
    } finally {
      setLoading(false);
    }
  };

  const restoreTeam = async (teamId) => {
    if (!window.confirm("Are you sure you want to restore this team?")) return;

    try {
      await axios.put(
        `http://localhost:5000/api/team/restore/${teamId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Team restored successfully!");
      fetchTrashedTeams();
    } catch (error) {
      console.error("Error restoring team:", error);
      alert("Failed to restore the team.");
    }
  };

  const permanentlyDeleteTeam = async (teamId) => {
    if (!window.confirm("This action is irreversible! Are you sure?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/team/delete-permanently/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Team permanently deleted!");
      fetchTrashedTeams();
    } catch (error) {
      console.error("Error permanently deleting team:", error);
      alert("Failed to delete the team.");
    }
  };

  if (loading) return <p className="text-center">Loading trashed teams...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-red-600">🗑️ Trashed Teams</h2>

      {trashedTeams.length === 0 ? (
        <p className="text-center text-gray-500">No trashed teams found.</p>
      ) : (
        <div className="space-y-4">
          {trashedTeams.map((team) => (
            <div key={team._id} className="p-4 border rounded-md shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">{team.teamName}</h3>
              <p className="text-gray-600">
                Members: {team.members.length} | Deleted At: {new Date(team.deletedAt).toLocaleString()}
              </p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => restoreTeam(team._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                >
                  Restore
                </button>
                <button
                  onClick={() => permanentlyDeleteTeam(team._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TrashTeams;
