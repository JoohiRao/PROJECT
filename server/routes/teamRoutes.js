const express = require("express");
const Team = require("../models/Team");
const TrashTeam = require("../models/TrashTeam");

const {
  getTeamOverview,
  getMemberInsights,
  getRecentActivity,
  getTaskOverview,
  getTeamProgress,
  getAllMembers,
  assignToTeam,
  removeFromTeam,
  updateRole,
  getMemberDetails,
  getAllTeams,
  getTeamDetails,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
  getTrashedTeams,
  trashTeam,
  restoreTeam,
  permanentlyDeleteTeam,

} = require("../controllers/teamController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Team Overview
router.get("/", getAllTeams);

// Member Insights
router.get("/member-insights", getMemberInsights);

// Recent Activity
router.get("/recent-activity", getRecentActivity);

// View All Members
router.get("/all-members", getAllMembers);

// Task Overview
router.get("/tasks-overview", getTaskOverview);

// Team Progress
router.get("/team-progress/:teamId", getTeamProgress);

// Assign/Reassign Teams
router.post("/assign-team", assignToTeam);

// Remove from Team
router.post("/remove-team", removeFromTeam);

// Update Role (Admin/User)
router.post("/update-role", updateRole);

// Detailed Member View
router.get("/member-details/:memberId", getMemberDetails);

// New Routes for View Teams Feature
// Get all teams with search and filter
router.get("/view-teams", getAllTeams);

// Get team details (members, tasks)
router.get("/details/:teamId", getTeamDetails);

// Edit team details (name, description)
router.put("/edit/:teamId", updateTeam);

// Delete team (move to trash)
router.delete("/delete/:teamId", deleteTeam);

// Add member to a team
router.post("/:teamId/add-member", addMember);

// Remove member from a team
router.post("/:teamId/remove-member", removeMember);

router.get("/trashed-teams", getTrashedTeams);
router.put("/trash/:teamId", trashTeam);
router.put("/restore/:teamId", restoreTeam);
router.delete("/delete-permanently/:teamId", permanentlyDeleteTeam);

module.exports = router;
