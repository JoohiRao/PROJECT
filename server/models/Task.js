const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["not started", "in progress", "completed"], default: "not started" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who is assigned the task
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who created the task
  deadline: { type: Date },
}, { timestamps: true });

module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);
