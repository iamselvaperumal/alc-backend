const express = require("express");
const router = express.Router();
const {
  generatePayroll,
  getPayroll,
  getPayrollById,
  updatePayroll,
  markAsPaid,
  deletePayroll,
} = require("../controllers/payrollController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getPayroll)
  .post(protect, adminOnly, generatePayroll);

router
  .route("/:id")
  .get(protect, getPayrollById)
  .put(protect, adminOnly, updatePayroll)
  .delete(protect, adminOnly, deletePayroll);

router.route("/:id/pay").put(protect, adminOnly, markAsPaid);

module.exports = router;
