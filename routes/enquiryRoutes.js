const express = require("express");
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.route("/").post(createEnquiry).get(protect, adminOnly, getEnquiries);

router
  .route("/:id")
  .get(protect, adminOnly, getEnquiryById)
  .put(protect, adminOnly, updateEnquiry)
  .delete(protect, adminOnly, deleteEnquiry);

module.exports = router;
