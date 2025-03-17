const Team = require("../models/Team");
const User = require("../models/User");
// const Team = require("../models/Team"); // Ensure this is correct
const TrashTeam = require("../models/TrashTeam");
// Create a new team
exports.createTeam = async (req, res) => {
    try {
      const { name } = req.body;
      const existingTeam = await Team.findOne({ name });
  
      if (existingTeam) return res.status(400).json({ message: "Team name already exists" });
  
      const team = new Team({ name, members: [] });
      await team.save();
  
      res.status(201).json({ message: "Team created successfully", team });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.addMemberToTeam = async (req, res) => {
    try {
      const { userId } = req.body;
      const team = await Team.findById(req.params.teamId);
      const user = await User.findById(userId);
  
      if (!team || !user) return res.status(404).json({ message: "Team or User not found" });
  
      if (team.members.includes(userId))
        return res.status(400).json({ message: "User is already in the team" });
  
      team.members.push(userId);
      await team.save();
  
      res.json({ message: "User added to team", team });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  // Remove a member from a team
exports.removeMemberFromTeam = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.teamId);

    if (!team) return res.status(404).json({ message: "Team not found" });

    team.members = team.members.filter((member) => member.toString() !== userId);
    await team.save();

    res.json({ message: "User removed from team", team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get all teams
exports.getAllTeams = async (req, res) => {
    try {
      const teams = await Team.find().populate("members", "name email");
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.deleteTeam = async (req, res) => {
    try {
      console.log("Received teamId:", req.params.teamId); // Debugging
  
      const team = await Team.findById(req.params.teamId);
  
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
  
      // Move the team to TrashTeam
      const trashedTeam = new TrashTeam({
        name: team.name,
        description: team.description,
        priority: team.priority,
        createdBy: team.createdBy,
        deletedAt: new Date(),
      });
  
      await trashedTeam.save(); // Save to TrashTeam collection
  
      await Team.findByIdAndDelete(req.params.teamId); // Delete from Team collection
  
      res.status(200).json({ message: "Team moved to trash successfully" });
    } catch (error) {
      console.error("Error deleting team:", error);
      res.status(500).json({ message: "Server error" });
    }
  };