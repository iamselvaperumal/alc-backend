const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["Planned", "Ongoing", "Completed", "On Hold"],
      default: "Planned",
    },
    assignedEmployees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    ],
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    startDate: { type: Date },
    deadline: { type: Date },
    completionDate: { type: Date },
    budget: { type: Number },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
