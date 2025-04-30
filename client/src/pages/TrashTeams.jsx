import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaRecycle } from "react-icons/fa"; // Import icons

function TrashTeams() {
  const [trashedTeams, setTrashedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    fetchTrashedTeams();
  }, []);

  // Fetch trashed teams
  const fetchTrashedTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/team/trashed-teams");
      setTrashedTeams(response.data.trashedTeams || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trashed teams:", error);
      setError("Failed to fetch trashed teams.");
      setLoading(false);
    }
  };

  // Restore team
  const handleRestoreTeam = async (teamId) => {
    if (!window.confirm("Are you sure you want to restore this team?")) return;

    try {
      await axios.put(
        `http://localhost:5000/api/team/restore/${teamId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Team restored!");
      fetchTrashedTeams();
    } catch (error) {
      console.error("Error restoring team:", error);
      alert("Failed to restore team.");
    }
  };

  // Permanently delete team
  const handlePermanentDelete = async (teamId) => {
    if (!window.confirm("This action is permanent. Delete team forever?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/team/delete-permanently/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Team permanently deleted!");
      fetchTrashedTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team permanently.");
    }
  };

  if (loading) return <p className="text-center text-white">Loading trashed teams...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h2 className="text-2xl font-bold text-center mb-6 tracking-wide">🗑️ Trashed Teams</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {trashedTeams.length > 0 ? (
          trashedTeams.map((team) => (
            <div
              key={team._id}
              className="bg-[#2A2A2A] p-8 rounded-lg shadow-md border border-gray-700 
              transform transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-red-400 flex items-center justify-between">
                {team.name}
                {/* <span className="text-gray-500 text-sm">#{team._id.slice(-4)}</span> */}
              </h3>
              <p className="text-gray-400 mt-2 text-sm">🗓️ Deleted At: {new Date(team.deletedAt).toLocaleDateString()}</p>

              <div className="mt-4 flex gap-4">
                <button
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 
                  transition-all duration-300 text-white px-4 py-1.5 rounded-md shadow 
                  hover:scale-105 text-sm"
                  onClick={() => handleRestoreTeam(team._id)}
                >
                  <FaRecycle className="text-base" />
                  Restore
                </button>

                <button
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 
                  transition-all duration-300 text-white px-4 py-1.5 rounded-md shadow 
                  hover:scale-105 text-sm"
                  onClick={() => handlePermanentDelete(team._id)}
                >
                  <FaTrashAlt className="text-base" />
                  Delete 
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-3">No trashed teams.</p>
        )}
      </div>
    </div>
  );
}

export default TrashTeams;
