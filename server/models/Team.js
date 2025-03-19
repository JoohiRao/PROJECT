const mongoose=require("mongoose")

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Team name is required"],
    unique: true,
    trim: true, // Ensure no leading/trailing spaces
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  deadline: { type: Date, required: true },
});

module.exports = mongoose.model("Team", TeamSchema);
