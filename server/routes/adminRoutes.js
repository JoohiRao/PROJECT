const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");


// 📌 Get Task Assignments Per Day
router.get("/task-assignment-graph",protect, adminOnly, adminController.getTaskAssignmentGraph);

// 📌 Get Task Progress Data
router.get("/task-progress-graph",protect, adminOnly, adminController.getTaskProgressGraph);

module.exports = router;
