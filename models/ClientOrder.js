const mongoose = require("mongoose");

const clientOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        fabricType: String,
        quantity: Number,
        color: String,
        specifications: String,
        unitPrice: Number,
        totalPrice: Number,
      },
    ],
    totalAmount: { type: Number },
    advanceAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "Order Received",
        "In Production",
        "Quality Check",
        "Ready for Dispatch",
        "Delivered",
        "Cancelled",
      ],
      default: "Order Received",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    orderDate: { type: Date, default: Date.now },
    deadline: { type: Date },
    deliveryDate: { type: Date },
    deliveryAddress: { type: String },
    remarks: { type: String },
    invoiceNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const ClientOrder = mongoose.model("ClientOrder", clientOrderSchema);
module.exports = ClientOrder;
