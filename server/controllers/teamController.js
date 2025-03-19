const Task = require("../models/Task");
const Team = require("../models/Team");
const User = require("../models/User");

exports.CreateTeam = async (req, res) => {
  try {
    const { name, members, priority, deadline } = req.body;

    // 🔴 Check for missing fields
    if (!name || !priority || !deadline || members.length === 0) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // 🔴 Check if a team with the same name already exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists!" });
    }

    // 🔹 Convert member emails to ObjectIds and ensure lowercase for roles
    const memberIds = await User.find({
      email: { $in: members },
    })
      .select("_id role")
      .lean();

    // Convert roles to lowercase
    memberIds.forEach((member) => {
      member.role = member.role.toLowerCase();
    });

    // Check if all members were found
    if (memberIds.length !== members.length) {
      return res.status(404).json({
        message: "Some members not found. Ensure all emails are registered.",
      });
    }

    const team = new Team({
      name,
      members: memberIds.map((user) => user._id),
      priority,
      deadline,
    });

    await team.save();
    res.status(201).json({ message: "Team created successfully!", team });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Failed to create the team!" });
  }
};


exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'name email');
    res.status(200).json({ teams });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch teams', error: err.message });
  }
};


// Task Overview
exports.getTaskOverview = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const pendingTasks = await Task.countDocuments({ status: "In Progress" });
        const overdueTasks = await Task.countDocuments({ deadline: { $lt: new Date() }, status: { $ne: "Completed" } });

        res.json({ totalTasks, completedTasks, pendingTasks, overdueTasks });
    } catch (error) {
        res.status(500).json({ message: "Error fetching task overview", error });
    }
};

// Team Overview
exports.getTeamOverview = async (req, res) => {
    try {
        const totalTeams = await Team.countDocuments();
        const totalMembers = await User.countDocuments();
        const recentTeams = await Team.find().sort({ createdAt: -1 }).limit(5);

        res.json({ totalTeams, totalMembers, recentTeams });
    } catch (error) {
        res.status(500).json({ message: "Error fetching team overview", error });
    }
};

const getTaskOverview = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({});
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const overdueTasks = await Task.countDocuments({ status: "Overdue" });

        res.status(200).json({
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks,
            overdue: overdueTasks,
        });
    } catch (error) {
        console.error("Error fetching task overview:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Member Insights
exports.getMemberInsights = async (req, res) => {
    try {
        const topContributors = await User.aggregate([
            { $unwind: "$tasksCompleted" },
            { $group: { _id: "$_id", name: { $first: "$name" }, taskCount: { $sum: 1 } } },
            { $sort: { taskCount: -1 } },
            { $limit: 5 }
        ]);

        const inactiveMembers = await User.find({ tasksAssigned: { $size: 0 } });

        res.json({ topContributors, inactiveMembers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching member insights", error });
    }
};

// Recent Activity
// Recent Activity
exports.getRecentActivity = async (req, res) => {
  try {
      const recentTasks = await Task.find().sort({ updatedAt: -1 }).limit(5);
      const recentMemberActivity = await User.find().sort({ lastActivity: -1 }).limit(5);

      res.json([...recentTasks, ...recentMemberActivity]);  // Combine as a single array
  } catch (error) {
      res.status(500).json({ message: "Error fetching recent activity", error });
  }
};


// View All Members
// View All Members



// In your backend - teamController.js

exports.getTeamProgress = async (req, res) => {
  try {
      const teamId = req.params.teamId;  // Assuming teamId is passed in the request params

      const teamMembers = await User.find({ teamId });
      const progressData = await Promise.all(
          teamMembers.map(async (member) => {
              const completedTasks = await Task.countDocuments({ assignedTo: member._id, status: "Completed" });
              const totalTasks = await Task.countDocuments({ assignedTo: member._id });

              return {
                  memberName: member.name,
                  completed: completedTasks,
                  total: totalTasks
              };
          })
      );

      res.status(200).json(progressData);
  } catch (error) {
      res.status(500).json({ message: "Error fetching team progress", error });
  }
};


exports.getAllMembers = async (req, res) => {
  try {
    const { search, teamId } = req.query;
    let members;

    if (teamId) {
      const team = await Team.findById(teamId).populate('members');
      members = team ? team.members : [];
    } else {
      members = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      });
    }

    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// Assign or Reassign to Teams
exports.assignToTeam = async (req, res) => {
  try {
      const { memberId, teamId } = req.body;

      await User.findByIdAndUpdate(memberId, { $addToSet: { assignedTeams: teamId } });
      res.json({ message: "Member assigned to team successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error assigning to team", error });
  }
};

// Remove Member from Team
exports.removeFromTeam = async (req, res) => {
  try {
      const { memberId, teamId } = req.body;

      await User.findByIdAndUpdate(memberId, { $pull: { assignedTeams: teamId } });
      res.json({ message: "Member removed from team successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error removing from team", error });
  }
};

// Update Role (Promote/Demote)
exports.updateRole = async (req, res) => {
  try {
      const { memberId, role } = req.body;

      await User.findByIdAndUpdate(memberId, { role });
      res.json({ message: "Role updated successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error updating role", error });
  }
};

// Get Detailed Member View
exports.getMemberDetails = async (req, res) => {
  try {
      const memberId = req.params.memberId;

      const member = await User.findById(memberId)
          .populate("assignedTeams", "name")
          .select("name email role");

      const tasks = await Task.find({ assignedTo: memberId });

      const completedTasks = tasks.filter(task => task.status === "Completed").length;
      const pendingTasks = tasks.filter(task => task.status !== "Completed").length;

      res.json({ member, completedTasks, pendingTasks, tasks });
  } catch (error) {
      res.status(500).json({ message: "Error fetching member details", error });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const { search, minSize, maxSize } = req.query;

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let teams = await Team.find(query).populate("members", "name email");

    // Filter by team size
    if (minSize || maxSize) {
      teams = teams.filter(
        (team) =>
          (!minSize || team.members.length >= minSize) &&
          (!maxSize || team.members.length <= maxSize)
      );
    }

    res.status(200).json({ teams });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teams", error: err.message });
  }
};

// Get Detailed Team Information (Members, Tasks)
exports.getTeamDetails = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const team = await Team.findById(teamId).populate("members", "name email role");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const tasks = await Task.find({ teamId });
    res.status(200).json({ team, tasks });
  } catch (err) {
    res.status(500).json({ message: "Error fetching team details", error: err.message });
  }
};

// Update Team Details (Edit Team Name, Description)
exports.updateTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, description } = req.body;

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { name, description },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({ message: "Team updated successfully", updatedTeam });
  } catch (err) {
    res.status(500).json({ message: "Failed to update team", error: err.message });
  }
};

// Delete Team (Move to Trash)
exports.deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Move to trash (if TrashTeam model exists)
    await TrashTeam.create(team.toObject());
    await Team.findByIdAndDelete(teamId);

    res.status(200).json({ message: "Team moved to trash successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete team", error: err.message });
  }
};

// Add a Member to a Team
exports.addMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { memberId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.includes(memberId)) {
      team.members.push(memberId);
      await team.save();
    }

    res.status(200).json({ message: "Member added to team successfully", team });
  } catch (err) {
    res.status(500).json({ message: "Failed to add member to team", error: err.message });
  }
};

// Remove a Member from a Team
exports.removeMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { memberId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    team.members = team.members.filter((member) => member.toString() !== memberId);
    await team.save();

    res.status(200).json({ message: "Member removed from team successfully", team });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove member from team", error: err.message });
  }
};

exports.getTrashedTeams = async (req, res) => {
  try {
    const trashedTeams = await Team.find({ isDeleted: true }).populate("members", "name email");
    res.json({ trashedTeams });
  } catch (error) {
    console.error("Error fetching trashed teams:", error);
    res.status(500).json({ message: "Failed to fetch trashed teams." });
  }
};

// 🗑️ Trash a Team (Soft Delete)
exports.trashTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found!" });
    }

    team.isDeleted = true;
    team.deletedAt = new Date();
    await team.save();

    res.json({ message: "Team moved to trash." });
  } catch (error) {
    console.error("Error trashing team:", error);
    res.status(500).json({ message: "Failed to trash the team." });
  }
};

// 🔄 Restore a Trashed Team
exports.restoreTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId);

    if (!team || !team.isDeleted) {
      return res.status(404).json({ message: "Team not found or not in trash!" });
    }

    team.isDeleted = false;
    team.deletedAt = null;
    await team.save();

    res.json({ message: "Team restored successfully." });
  } catch (error) {
    console.error("Error restoring team:", error);
    res.status(500).json({ message: "Failed to restore the team." });
  }
};

// 🚨 Permanently Delete a Team
exports.permanentlyDeleteTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId);

    if (!team || !team.isDeleted) {
      return res.status(404).json({ message: "Team not found or not in trash!" });
    }

    await Team.findByIdAndDelete(teamId);

    res.json({ message: "Team permanently deleted." });
  } catch (error) {
    console.error("Error permanently deleting team:", error);
    res.status(500).json({ message: "Failed to permanently delete the team." });
  }
};