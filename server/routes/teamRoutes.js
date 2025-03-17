const express=require("express")
const Team = require("../models/Team"); // Ensure this is correct
const TrashTeam = require("../models/TrashTeam");

const {
    createTeam,
    addMemberToTeam,
    removeMemberFromTeam,
    getAllTeams,
    deleteTeam,
  } = require("../controllers/teamController");
  const { protect, adminOnly } = require("../middleware/authMiddleware");



  const router = express.Router();

router.post("/", protect, adminOnly, createTeam); // Create team
router.get("/", protect, adminOnly, getAllTeams); // Get all teams
router.post("/:teamId/add-member", protect, adminOnly, addMemberToTeam); // Add member to team
router.put("/:teamId/remove-member", protect, adminOnly, removeMemberFromTeam); // Remove member from team
router.delete("/:teamId", protect,  deleteTeam); // Delete team

router.get("/trash", protect, adminOnly, async (req, res) => {
  try {
    const trashedTeams = await TrashTeam.find({ isDeleted: true });
    res.json(trashedTeams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Soft delete a team instead of permanently deleting it
router.delete("/:teamId/delete", protect, async (req, res) => {
  try {
    const { teamId } = req.params;

    const deletedTeam = await Team.findByIdAndUpdate(
      teamId,
      { isDeleted: true }, // Mark as deleted instead of removing it
      { new: true }
    );

    if (!deletedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({ message: "Team moved to trash", deletedTeam });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// 🔄 Restore a team from Trash
router.put("/:teamId/restore", protect, async (req, res) => {
  try {
    const { teamId } = req.params;
    console.log("🔍 Searching for team ID:", teamId); // Debugging

    const existingTeam = await Team.findById(teamId);
    console.log("✅ Found team:", existingTeam); // Debugging

    if (!existingTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!existingTeam.isDeleted) {
      return res.status(400).json({ message: "Team is already active" });
    }

    existingTeam.isDeleted = false;
    await existingTeam.save();

    res.status(200).json({ message: "Team restored successfully", restoredTeam: existingTeam });
  } catch (error) {
    console.error("Error restoring team:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;