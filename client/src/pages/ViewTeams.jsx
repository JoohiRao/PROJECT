import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewTeams = () => {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [editingTeam, setEditingTeam] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const [newMember, setNewMember] = useState("");
  const navigate = useNavigate();

  // User Authentication Token
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    fetchTeams();
  }, []);

  // Fetch teams based on filters
  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/team", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, minSize, maxSize },
      });
      setTeams(res.data.teams);
    } catch (err) {
      console.error("Error fetching teams:", err);
      alert("Failed to fetch teams. Please try again.");
    }
  };

  // Delete a team
  const handleDelete = async (teamId) => {
    try {
      await axios.delete(`http://localhost:5000/api/team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Team deleted successfully!");
      fetchTeams();
    } catch (err) {
      console.error("Error deleting team:", err);
      alert("Failed to delete the team. Please try again.");
    }
  };

  // Edit a team
  const handleEdit = (team) => {
    setEditingTeam(team._id);
    setEditData({ name: team.name, description: team.description });
  };

  // Save edited team details
  const handleSaveEdit = async (teamId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/team/${teamId}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingTeam(null);
      alert("Team updated successfully!");
      fetchTeams();
    } catch (err) {
      console.error("Error saving team:", err);
      alert("Failed to update the team. Please try again.");
    }
  };

  // Add a new member to a team
  const handleAddMember = async (teamId) => {
    if (!newMember) {
      alert("Enter a valid Member ID.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/team/${teamId}/add-member`,
        { memberId: newMember },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMember("");
      alert("Member added successfully!");
      fetchTeams();
    } catch (err) {
      console.error("Error adding member:", err);
      alert("Failed to add member. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Manage Teams</h1>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search teams"
          className="p-2 bg-[#1a1a1a] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          value={minSize}
          onChange={(e) => setMinSize(e.target.value)}
          placeholder="Min Team Size"
          className="p-2 bg-[#1a1a1a] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          value={maxSize}
          onChange={(e) => setMaxSize(e.target.value)}
          placeholder="Max Team Size"
          className="p-2 bg-[#1a1a1a] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchTeams}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
        >
          Filter
        </button>
      </div>

      {/* Team List */}
      <div className="w-full max-w-4xl">
        {teams.map((team) => (
          <div key={team._id} className="bg-[#1a1a1a] p-4 mb-4 rounded-lg shadow-md">
            {editingTeam === team._id ? (
              <>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Team Name"
                  className="w-full p-2 mb-2 bg-[#333] border border-gray-600 rounded-md text-gray-200"
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Team Description"
                  className="w-full p-2 mb-2 bg-[#333] border border-gray-600 rounded-md text-gray-200"
                />
                <button onClick={() => handleSaveEdit(team._id)} className="bg-green-600 px-3 py-1 rounded-md mr-2 hover:bg-green-500">
                  Save
                </button>
                <button onClick={() => setEditingTeam(null)} className="bg-gray-600 px-3 py-1 rounded-md hover:bg-gray-500">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-blue-400">{team.name}</h2>
                <p className="text-gray-400 mb-2">{team.description}</p>
                <ul className="mb-2">
                  {team.members.map((member) => (
                    <li key={member._id} className="text-gray-300 flex justify-between items-center mb-1">
                      {member.name} ({member.email})
                      <button onClick={() => handleDelete(team._id)} className="text-red-500 hover:text-red-400">
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleEdit(team)} className="bg-yellow-500 px-3 py-1 mr-2 rounded-md hover:bg-yellow-400">
                  Edit
                </button>
                <button onClick={() => handleDelete(team._id)} className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-500">
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewTeams;
