const mongoose = require("mongoose");

const productionTaskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    description: { type: String },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "ClientOrder" },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    stage: {
      type: String,
      enum: [
        "Raw Material",
        "Weaving",
        "Dyeing",
        "Quality Check",
        "Packaging",
        "Completed",
      ],
      default: "Raw Material",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "On Hold"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    expectedCompletionDate: { type: Date },
    actualCompletionDate: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    quality: {
      type: String,
      enum: ["Not Started", "In Review", "Passed", "Failed"],
    },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const ProductionTask = mongoose.model("ProductionTask", productionTaskSchema);
module.exports = ProductionTask;
