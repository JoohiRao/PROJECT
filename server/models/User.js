const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  tasksAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // ✅ Track assigned tasks
  tasksCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    lastActivity: Date},
    { timestamps: true });


module.exports = mongoose.model("User", userSchema);
