import React, { useState } from "react";
import axios from "axios";

function CreateTeams() {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-600">Only admins can create teams.</p>
      </div>
    );
  }

  // 🔹 Add Members by Email
  const handleAddMemberByEmail = () => {
    if (email.trim() && !members.includes(email)) {
      setMembers([...members, email]);
      setEmail("");
    }
  };

  // 🔹 Remove Member from List
  const handleRemoveMember = (removeEmail) => {
    setMembers(members.filter((m) => m !== removeEmail));
  };

  // 🔹 Create Team Request
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/team/create-team",
        { name: teamName, members, priority, deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ text: response.data.message, type: "success" });
      setTeamName("");
      setMembers([]);
      setPriority("Medium");
      setDeadline("");
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Something went wrong",
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Create a New Team</h2>

      {/* 🔹 Success/Error Message */}
      {message && (
        <div
          className={`text-center p-2 mb-3 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleCreateTeam} className="space-y-4">
        {/* 🆕 Team Name Input */}
        <div>
          <label className="block text-gray-700 font-medium">Team Name</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            required
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 🆕 Priority Selection */}
        <div>
          <label className="block text-gray-700 font-medium">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* 🆕 Deadline Selection */}
        <div>
          <label className="block text-gray-700 font-medium">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 🆕 Add Members by Email */}
        <div>
          <label className="block text-gray-700 font-medium">Add Members (By Email)</label>
          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member email"
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddMemberByEmail}
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* 🆕 Member List Display */}
        {members.length > 0 && (
          <div className="bg-gray-100 p-2 rounded-md mt-2">
            <h3 className="text-gray-700 font-medium">Team Members</h3>
            <ul className="space-y-1">
              {members.map((member, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
                >
                  <span className="text-gray-800">{member}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </div>
  );
}

export default CreateTeams;
