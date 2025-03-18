const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  description: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },

   
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model("Team", TeamSchema);
