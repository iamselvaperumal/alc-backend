const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    designation: { type: String },
    salary: { type: Number },
    dateOfJoining: { type: Date },
    dateOfBirth: { type: Date },
    phone: { type: String },
    address: { type: String },
    panNumber: { type: String },
    aadharNumber: { type: String },
    bankAccount: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
    emergencyContactName: { type: String },
    emergencyContactPhone: { type: String },
    isActive: { type: Boolean, default: true },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true },
);

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
