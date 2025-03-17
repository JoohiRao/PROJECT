const express = require("express");
const { 
    getUserTasks, updateTaskStatus, setTaskPriority, 
    createTask, updateTask, deleteTask , getTaskStatusGraph, getTaskPriorityGraph 
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
// const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/tasks", protect, getUserTasks); // ✅ Get all tasks assigned or created by the user
router.post("/task", protect, createTask); // ✅ Create a new task
router.patch("/task/:taskId/update", protect, updateTask); // ✅ Update task details
router.delete("/task/:taskId", protect, deleteTask); // ✅ Delete task
router.patch("/task/:taskId/status", protect, updateTaskStatus); // ✅ Update task status
router.get("/graph/task-status", protect, getTaskStatusGraph);
router.patch("/task/:taskId/priority", protect, setTaskPriority); // ✅ Update task priority
router.get("/graph/task-priority", protect, getTaskPriorityGraph);


module.exports = router;
