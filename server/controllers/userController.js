const Task = require("../models/Task");
const User=require("../models/User")
const mongoose=require("mongoose")
// ✅ 1. Get All Tasks (Created or Assigned)
exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from token
    const tasks = await Task.find({ $or: [{ assignedTo: userId }, { createdBy: userId }] }).sort({ createdAt: -1 });

    res.json(tasks.length ? tasks : { message: "No tasks found" });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ 2. Create a New Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline } = req.body;

    const newTask = new Task({
      title,
      description,
      priority: priority || "medium",
      status: "not started",
      assignedTo: req.user.id, // User assigns task to themselves
      createdBy: req.user.id, // User who created it
      deadline
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ 3. Update Task Details (Only if User Created It)
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, deadline } = req.body;

    const task = await Task.findOne({ _id: taskId, createdBy: req.user.id });

    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.deadline = deadline || task.deadline;

    await task.save();
    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ 4. Delete Task (Only if User Created It)
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOneAndDelete({ _id: taskId, createdBy: req.user.id });

    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ 5. Update Task Status




// ✅ Update Task Status & Fetch Updated Graph Data
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    console.log("🔹 Task Update Request Received:", { taskId, status });

    if (!["not started", "in progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

    if (!task) {
      console.log("❌ Task Not Found");
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("✅ Task Updated Successfully:", task);

    // Fetch the updated graph data
    const updatedGraph = await getTaskStatusData(task.createdBy);

    console.log("📊 Updated Graph Data:", updatedGraph);

    res.json({
      message: "Task status updated",
      task,
      graph: updatedGraph, // ✅ Send updated graph data
    });
  } catch (error) {
    console.error("❌ Error updating task status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Fetch Task Status Graph
exports.getTaskStatusGraph = async (req, res) => {
  try {
    const graphData = await getTaskStatusData(req.user.id);
    res.json(graphData);
  } catch (error) {
    console.error("❌ Error fetching task status graph:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Helper Function to Get Fresh Graph Data
const getTaskStatusData = async (userId) => {
  try {
    console.log("🔍 Fetching Task Status Graph for User ID:", userId);

    const statusCounts = await Task.aggregate([
      {
        $match: {
          $or: [
            { assignedTo: new mongoose.Types.ObjectId(userId) }, 
            { createdBy: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $group: {
          _id: { $toLower: "$status" },  // Convert status to lowercase for consistency
          count: { $sum: 1 }
        }
      }
    ]);

    console.log("📊 Aggregated Status Counts:", statusCounts);

    // Default structure for status counts
    const result = { "not started": 0, "in progress": 0, "completed": 0 };

    // Populate result with database values
    statusCounts.forEach(({ _id, count }) => {
      if (result.hasOwnProperty(_id)) {
        result[_id] = count;
        count++;
      }
    });

    console.log("📊 Updated Task Status Graph:", result);

    return result;
  } catch (error) {
    console.error("❌ Error in getTaskStatusData:", error);
    return { "not started": 0, "in progress": 0, "completed": 0 };
  }
};




// ✅ 6. Set Task Priority
exports.setTaskPriority = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { priority } = req.body;

    if (!["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    const task = await Task.findByIdAndUpdate(taskId, { priority }, { new: true });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task priority updated", task });
  } catch (error) {
    console.error("Error updating task priority:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// ✅ 5. Get Task Status Count (Graph Data)

exports.getTaskPriorityGraph = async (req, res) => {
  try {
      const userId = new mongoose.Types.ObjectId(req.user.id);  // Convert userId to ObjectId

      console.log("🔍 Fetching Task Priority Graph for User ID:", userId);

      // Aggregation pipeline to count tasks by priority
      const priorityCounts = await Task.aggregate([
          { 
              $match: { 
                  $or: [{ assignedTo: userId }, { createdBy: userId }] 
              } 
          },
          { 
              $group: { 
                  _id: { $toLower: "$priority" },  // Convert priority to lowercase
                  count: { $sum: 1 } 
              } 
          }
      ]);

      console.log("📊 Aggregated Priority Counts:", priorityCounts);

      // Default priority structure
      const result = { low: 0, medium: 0, high: 0 };
      
      // Map database results to the response object
      priorityCounts.forEach(({ _id, count }) => {
          if (result.hasOwnProperty(_id)) {
              result[_id] = count;
          }
      });

      console.log("📊 Final Priority Result:", result);

      res.json(result);
  } catch (error) {
      console.error("❌ Error fetching task priority graph:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};