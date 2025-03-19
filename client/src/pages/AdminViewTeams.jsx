import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaPlus,FaTasks,FaUser, FaChevronDown,FaCalendarAlt, FaChevronUp, FaUserPlus } from "react-icons/fa";

const AdminViewTeams = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [userId, setUserId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");

  // Fetch all teams on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/t/teams");
      setTeams(response.data.teams || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
    }
  };

  // Delete a team
  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/t/teams/${teamId}`);
      alert("Team deleted successfully!");
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team.");
    }
  };

  // Fetch team members and tasks
  const fetchTeamDetails = async (teamId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/t/teams/${teamId}`);
      return response.data.members;
    } catch (error) {
      console.error("Error fetching team details:", error);
      return [];
    }
  };

  // Toggle team member view
  const toggleAccordion = async (teamId) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null);
    } else {
      const members = await fetchTeamDetails(teamId);
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team._id === teamId ? { ...team, members } : team
        )
      );
      setExpandedTeam(teamId);
    }
  };

  // Remove a member from the team
  const handleRemoveMember = async (teamId, memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/t/teams/${teamId}/remove-member/${memberId}`
      );
      alert("Member removed successfully!");
      toggleAccordion(teamId);
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove member.");
    }
  };

  // Add member and assign task
  const handleAddMember = async () => {
    if (!selectedTeam || !userId || !taskName || !priority || !deadline) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      // Fetch user by email
      const userResponse = await axios.get(
        `http://localhost:5000/api/t/users?email=${userId}`
      );
  
      if (!userResponse.data) {
        alert("User not found! Please check the email.");
        return;
      }
  
      const user = userResponse.data;
  
      // Log user data for debugging
      console.log("Fetched User:", user);
  
      // Ensure the role is "User" or "Admin"
      if (user.role !== "user" && user.role !== "admin") {
        alert("Invalid user role! Please check the user's role.");
        return;
      }
  
      // Assign task to member
      await axios.post(
        `http://localhost:5000/api/t/teams/${selectedTeam}/add-member`,
        { userId: user._id, taskName, priority, deadline }
      );
  
      alert("Member added and task assigned successfully!");
      setUserId("");
      setTaskName("");
      setPriority("");
      setDeadline("");
      toggleAccordion(selectedTeam); // Refresh the members list
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member. Please check the email and try again.");
    }
  };
  
  
  return (
    <div className="p-6 bg-black min-h-screen">
      <h2 className="text-3xl font-bold text-white mb-6">Admin - Manage Teams</h2>

{/* Display all teams */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
  {teams.length > 0 ? (
    teams.map((team) => (
      <div key={team._id} className="bg-[#2A2A2A] rounded-lg shadow-lg p-5 text-white">
        <h3 className="text-xl font-semibold text-yellow-400">{team.name}</h3>
        <p className="text-gray-400">Priority: <span className="text-red-400">{team.priority}</span></p>
        <p className="text-gray-400">Deadline: <span className="text-blue-300">{new Date(team.deadline).toLocaleDateString()}</span></p>

        {/* Button Container */}
        <div className="mt-4 flex justify-between">
          {/* Toggle View Members */}
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded transition-all"
            onClick={() => toggleAccordion(team._id)}
          >
            {expandedTeam === team._id ? "Hide Members" : "View Members"}
            {expandedTeam === team._id ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {/* Delete Team */}
          <button
            className="flex items-center gap-2 bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded transition-all"
            onClick={() => handleDeleteTeam(team._id)}
          >
            Delete Team <FaTrash />
          </button>
        </div>

        {/* Team Members (Expandable Section) */}
        {expandedTeam === team._id && (
          <div className="mt-4 p-4 border border-gray-700 rounded bg-gray-900">
            <h4 className="text-lg font-semibold mb-3 text-green-400 flex items-center gap-2">
              <FaUser /> Team Members & Tasks
            </h4>

            {team.members?.length > 0 ? (
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div key={member._id} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                    {/* Member Details */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-yellow-400 font-medium">{member.name}</p>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded transition-all"
                        onClick={() => handleRemoveMember(team._id, member._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Assigned Tasks */}
                    <div className="mt-3">
                      <h5 className="font-semibold text-blue-300">Assigned Tasks:</h5>
                      {member.tasksAssigned && member.tasksAssigned.length > 0 ? (
                        <ul className="list-disc ml-4 text-gray-300">
                          {member.tasksAssigned.map((task, index) => (
                            <li key={index}>{task.title}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">No tasks assigned yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No members yet.</p>
            )}
          </div>
        )}
      </div>
    ))
  ) : (
    <p className="text-gray-400">Loading teams...</p>
  )}
</div>



      {/* Add Member Form */}

      <div className="bg-[#2A2A2A] rounded-lg shadow-lg p-6 max-w-lg mx-auto text-white">
  <h3 className="text-2xl font-semibold text-white mb-4">Add Member to Team</h3>

  {/* Team Selection Dropdown */}
  <div className="relative mb-4">
    <select
      value={selectedTeam}
      onChange={(e) => setSelectedTeam(e.target.value)}
      className="w-full px-4 py-3 border border-gray-600 rounded-md bg-black text-white appearance-none"
    >
      <option value="">Select a Team</option>
      {teams.map((team) => (
        <option key={team._id} value={team._id}>
          {team.name}
        </option>
      ))}
    </select>
    <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  </div>

  {/* User Email Input */}
  <div className="flex items-center bg-black border border-gray-600 rounded-md px-3 py-2 mb-4">
    <FaUserPlus className="text-gray-400 mr-2" />
    <input
      type="text"
      placeholder="Enter User Email"
      value={userId}
      onChange={(e) => setUserId(e.target.value)}
      className="w-full bg-transparent outline-none text-white"
    />
  </div>

  {/* Task Name Input */}
  <div className="flex items-center bg-black border border-gray-600 rounded-md px-3 py-2 mb-4">
    <FaTasks className="text-gray-400 mr-2" />
    <input
      type="text"
      placeholder="Enter Task Name"
      value={taskName}
      onChange={(e) => setTaskName(e.target.value)}
      className="w-full bg-transparent outline-none text-white"
    />
  </div>

  {/* Deadline Input */}
  <div className="flex items-center bg-black border border-gray-600 rounded-md px-3 py-2 mb-4">
    <FaCalendarAlt className="text-gray-400 mr-2" />
    <input
      type="date"
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
      className="w-full bg-transparent outline-none text-white"
    />
  </div>

  {/* Priority Selection */}
  <div className="relative mb-4">
    <select
      value={priority}
      onChange={(e) => setPriority(e.target.value)}
      className="w-full px-4 py-3 border border-gray-600 rounded-md bg-black text-white appearance-none"
    >
      <option value="">Select Priority</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
    <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  </div>

  {/* Submit Button */}
  <button
    onClick={handleAddMember}
    className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition duration-300"
  >
    Add Member & Assign Task
  </button>
</div>
      
    </div>
  );
};

export default AdminViewTeams;
