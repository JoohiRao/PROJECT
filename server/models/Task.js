const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["not started", "in progress", "completed"], default: "not started" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deadline: { type: Date },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
