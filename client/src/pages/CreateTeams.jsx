import React, { useState } from "react";
import axios from "axios";

function CreateTeams() {
  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const user = JSON.parse(localStorage.getItem("user")); // ✅ Get stored user
  const token = user?.token; 

  if (!user || user.role !== "admin") {
    setMessage({ text: "Access Denied: Admins Only", type: "error" });
    setLoading(false);
    return;
  }

    try {
      const response = await axios.post("http://localhost:5000/api/team", { name: teamName },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token in headers
          },
        }
      );
      setMessage({ text: response.data.message, type: "success" });
      setTeamName("");
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

      {message && (
        <div
          className={`text-center p-2 mb-3 rounded-md ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleCreateTeam} className="space-y-4">
        {/* Team Name Input */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </div>
  );
}

export default CreateTeams;
