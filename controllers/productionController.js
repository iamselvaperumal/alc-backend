const ProductionTask = require("../models/ProductionTask");

// @desc    Create Production Task
// @route   POST /api/production
// @access  Private/Admin
const createProductionTask = async (req, res) => {
  try {
    const {
      taskName,
      description,
      order,
      department,
      assignedTo,
      stage,
      startDate,
      expectedCompletionDate,
      priority,
    } = req.body;

    const task = await ProductionTask.create({
      taskName,
      description,
      order,
      department,
      assignedTo,
      stage,
      startDate,
      expectedCompletionDate,
      priority: priority || "Medium",
      status: "Pending",
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error in createProductionTask:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Production Tasks
// @route   GET /api/production
// @access  Private
const getProductionTasks = async (req, res) => {
  try {
    const { stage, status, department } = req.query;
    let query = {};

    if (stage) query.stage = stage;
    if (status) query.status = status;
    if (department) query.department = department;

    const tasks = await ProductionTask.find(query)
      .populate("order", "orderNumber items totalAmount status")
      .populate("department", "name")
      .populate({
        path: "assignedTo",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Error in getProductionTasks:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get production task by ID
// @route   GET /api/production/:id
// @access  Private
const getProductionTaskById = async (req, res) => {
  try {
    const task = await ProductionTask.findById(req.params.id)
      .populate("order")
      .populate("department", "name")
      .populate({
        path: "assignedTo",
        populate: {
          path: "user",
          select: "username email phone",
        },
      });

    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: "Production task not found" });
    }
  } catch (error) {
    console.error("Error in getProductionTaskById:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Production Task Status/Stage
// @route   PUT /api/production/:id
// @access  Private (Admin/Employee assigned)
const updateProductionTask = async (req, res) => {
  try {
    const task = await ProductionTask.findById(req.params.id);

    if (task) {
      task.taskName = req.body.taskName || task.taskName;
      task.description = req.body.description || task.description;
      task.stage = req.body.stage || task.stage;
      task.status = req.body.status || task.status;
      task.priority = req.body.priority || task.priority;
      task.assignedTo = req.body.assignedTo || task.assignedTo;
      task.progress =
        req.body.progress !== undefined ? req.body.progress : task.progress;
      task.quality = req.body.quality || task.quality;
      task.notes = req.body.notes || task.notes;

      if (req.body.status === "Completed") {
        task.actualCompletionDate = new Date();
      }

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.error("Error in updateProductionTask:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete production task
// @route   DELETE /api/production/:id
// @access  Private/Admin
const deleteProductionTask = async (req, res) => {
  try {
    const task = await ProductionTask.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      res.json({ message: "Production task removed" });
    } else {
      res.status(404).json({ message: "Production task not found" });
    }
  } catch (error) {
    console.error("Error in deleteProductionTask:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProductionTask,
  getProductionTasks,
  getProductionTaskById,
  updateProductionTask,
  deleteProductionTask,
};
