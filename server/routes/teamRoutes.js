const express=require("express")


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
router.delete("/:teamId", protect, adminOnly, deleteTeam); // Delete team

module.exports = router;