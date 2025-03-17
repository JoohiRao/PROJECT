const mongoose = require("mongoose");
const Team = require("./Team"); 
const User=require("./User")
const TrashTeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrashTeam", TrashTeamSchema);
