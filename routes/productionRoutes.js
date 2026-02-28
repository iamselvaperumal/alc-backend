const express = require("express");
const router = express.Router();
const {
  createProductionTask,
  getProductionTasks,
  getProductionTaskById,
  updateProductionTask,
  deleteProductionTask,
} = require("../controllers/productionController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getProductionTasks)
  .post(protect, adminOnly, createProductionTask);

router
  .route("/:id")
  .get(protect, getProductionTaskById)
  .put(protect, updateProductionTask)
  .delete(protect, adminOnly, deleteProductionTask);

module.exports = router;
