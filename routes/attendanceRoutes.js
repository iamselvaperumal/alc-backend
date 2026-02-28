const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, markAttendance)
  .get(protect, adminOnly, getAllAttendance);

router
  .route("/:id")
  .put(protect, adminOnly, updateAttendance)
  .delete(protect, adminOnly, deleteAttendance);

router.route("/employee/:employeeId").get(protect, getAttendance);

module.exports = router;
