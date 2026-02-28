const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getFabricTypes,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.route("/").get(protect, getOrders).post(protect, createOrder);

router.route("/fabrics").get(getFabricTypes);

router
  .route("/:id")
  .get(protect, getOrderById)
  .put(protect, adminOnly, updateOrder)
  .delete(protect, adminOnly, deleteOrder);

module.exports = router;
