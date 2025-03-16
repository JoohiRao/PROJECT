const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// 📌 Get Task Assignments Per Day
router.get("/task-assignment-graph", adminController.getTaskAssignmentGraph);

// 📌 Get Task Progress Data
router.get("/task-progress-graph", adminController.getTaskProgressGraph);

module.exports = router;
