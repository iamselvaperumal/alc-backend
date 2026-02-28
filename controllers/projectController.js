const Project = require("../models/Project");

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      client,
      status,
      department,
      assignedEmployees,
      startDate,
      deadline,
      budget,
      priority,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      client,
      status,
      department,
      assignedEmployees,
      startDate,
      deadline,
      budget,
      priority,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Error in createProject:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const { client } = req.query;
    let query = {};
    if (client) {
      query.client = client;
    }

    const projects = await Project.find(query)
      .populate({
        path: "assignedEmployees",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .populate("department", "name")
      .populate("client", "username email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error("Error in getProjects:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: "assignedEmployees",
        populate: {
          path: "user",
          select: "username email phone",
        },
      })
      .populate("department", "name")
      .populate("client", "username email");

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.error("Error in getProjectById:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = req.body.title || project.title;
      project.description = req.body.description || project.description;
      project.client = req.body.client || project.client;
      project.status = req.body.status || project.status;
      project.department = req.body.department || project.department;
      project.assignedEmployees =
        req.body.assignedEmployees || project.assignedEmployees;
      project.startDate = req.body.startDate || project.startDate;
      project.deadline = req.body.deadline || project.deadline;
      project.budget = req.body.budget || project.budget;
      project.progress = req.body.progress || project.progress;
      project.priority = req.body.priority || project.priority;

      if (req.body.status === "Completed") {
        project.completionDate = new Date();
      }

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.error("Error in updateProject:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: "Project removed" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.error("Error in deleteProject:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
