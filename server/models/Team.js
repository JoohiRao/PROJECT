const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Remove `required: true`
  isDeleted: { type: Boolean, default: false } 
});

module.exports = mongoose.model("Team", teamSchema);
