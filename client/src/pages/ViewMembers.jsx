import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";

function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    fetchTeams();
    fetchMembers();
  }, [search, filterTeam]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/team", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data.teams);
    } catch (err) {
      setError("Failed to fetch teams");
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/team/all-members", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, teamId: filterTeam },
      });
      setMembers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await axios.post(
        "http://localhost:5000/api/team/update-role",
        { memberId, role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMembers();
    } catch (err) {
      alert("Failed to update role");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400">Manage Team Members</h2>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="p-2 w-72 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400"
        />
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="p-2 w-40 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div>

      {/* Loading and Error */}
      {loading && <p className="text-yellow-400">Loading members...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Member List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {members.map((member) => (
          <div
            key={member._id}
            className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold">
                {member.name}{" "}
                <span className="text-yellow-400">({member.email})</span>
              </p>
              <p className="text-sm text-gray-400">Role: {member.role}</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={member.role}
                onChange={(e) => handleRoleChange(member._id, e.target.value)}
                className="p-1 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <FaUserEdit className="text-yellow-400 text-xl cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewMembers;
