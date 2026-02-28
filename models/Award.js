const mongoose = require("mongoose");

const awardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    awardDate: { type: Date, required: true },
    issuingOrganization: { type: String },
    certificate: { type: String }, // URL or file path
    category: {
      type: String,
      enum: ["Certification", "Award", "Recognition", "ISO", "Other"],
      default: "Award",
    },
    imageUrl: { type: String },
    displayOrder: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Award = mongoose.model("Award", awardSchema);
module.exports = Award;
