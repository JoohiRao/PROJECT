const Task = require("../models/Task");

// 📌 Get Task Assignment Count Per Day
exports.getTaskAssignmentGraph = async (req, res) => {
    try {
      const tasks = await Task.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },  // ✅ Ensure Correct Date Formatting
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      res.json(tasks.length ? tasks : [{ message: "No tasks assigned yet" }]);
    } catch (error) {
      console.error("Error fetching task assignment data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

// 📌 Get Task Progress Overview
exports.getTaskProgressGraph = async (req, res) => {
  try {
    const taskData = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json(taskData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
