const express = require("express");
const router = express.Router();
const {
  createAward,
  getAwards,
  getAwardById,
  updateAward,
  deleteAward,
} = require("../controllers/awardController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.route("/").get(getAwards).post(protect, adminOnly, createAward);

router
  .route("/:id")
  .get(getAwardById)
  .put(protect, adminOnly, updateAward)
  .delete(protect, adminOnly, deleteAward);

module.exports = router;
