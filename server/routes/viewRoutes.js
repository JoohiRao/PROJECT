const express = require("express");
const router = express.Router();
const mongoose=require("mongoose")
const Team = require("../models/Team");
const User = require("../models/User");
const Task=require("../models/Task")

// Get all teams
router.get("/teams", async (req, res) => {
    try {
      const teams = await Team.find({});
      res.status(200).json({ teams });
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams." });
    }
  });

// User fetching endpoint
router.get("/users", async (req, res) => {
    const { email } = req.query;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user." });
    }
  });
  

// Add member and assign task
// Add member and assign task
// Backend Route
// Backend - Express Route Example
// Add a member to a team and assign a task
// Add a member to a team and assign a task
router.post("/teams/:teamId/add-member", async (req, res) => {
    try {
      const { teamId } = req.params;
      const { userId, taskName, priority, deadline } = req.body;
  
      // Validate team
      const team = await Team.findById(teamId);
      if (!team) return res.status(404).json({ message: "Team not found." });
  
      // Validate user
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });
  
      // Add member to team
      if (!team.members.includes(user._id)) {
        team.members.push(user._id);
        await team.save();
      }
  
      // Create a new task and assign it
      const task = new Task({
        title: taskName,
        priority,
        deadline,
        assignedTo: user._id,
        team: team._id,
      });
  
      await task.save();
  
      // Assign task to user and team
      user.tasksAssigned.push(task._id);
      await user.save();
  
      team.tasks.push(task._id);
      await team.save();
  
      res.status(200).json({ message: "Member added and task assigned successfully!", task });
    } catch (error) {
      console.error("Error adding member:", error);
      res.status(500).json({ message: "Failed to add member or assign task." });
    }
  });
  
  
// Update team details
router.put("/teams/:teamId", async (req, res) => {
  try {
    await Team.findByIdAndUpdate(req.params.teamId, req.body);
    res.json({ message: "Team updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating team" });
  }
});

// Delete team (move to trash)
router.delete("/teams/:teamId", async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.teamId);
    res.json({ message: "Team deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting team" });
  }
});

router.get("/teams/:teamId", async (req, res) => {
    try {
      const team = await Team.findById(req.params.teamId)
        .populate({
          path: "members",
          select: "name email tasksAssigned",
          populate: {
            path: "tasksAssigned",
            select: "taskName priority deadline title"
          }
        })
        .populate("tasks", "taskName priority deadline");

      if (!team) {
        return res.status(404).json({ message: "Team not found." });
      }

      res.status(200).json({
        name: team.name,
        priority: team.priority,
        tasks: team.tasks,
        members: team.members
      });
    } catch (error) {
      console.error("Error fetching team details:", error);
      res.status(500).json({ message: "Failed to fetch team details." });
    }
});

  
// Get team tasks
router.get("/teams/:teamId/tasks", async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId).populate("tasks.assignedTo");
    res.json(team.tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});


  router.delete("/teams/:teamId/remove-member/:userId", async (req, res) => {
    try {
      const { teamId, userId } = req.params;
  
      const team = await Team.findById(teamId);
      if (!team) return res.status(404).json({ message: "Team not found." });
  
      // Remove member from team
      team.members = team.members.filter((member) => member.toString() !== userId);
      await team.save();
  
      res.status(200).json({ message: "Member removed successfully!" });
    } catch (error) {
      console.error("Error removing member:", error);
      res.status(500).json({ message: "Failed to remove member from team." });
    }
  });

module.exports = router;
