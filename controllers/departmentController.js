const Department = require("../models/Department");

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
  try {
    const { name, description, headOfDepartment } = req.body;

    const departmentExists = await Department.findOne({ name });
    if (departmentExists) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = await Department.create({
      name,
      description,
      headOfDepartment,
    });

    res.status(201).json(department);
  } catch (error) {
    console.error("Error in createDepartment:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public/Private
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate({
      path: "headOfDepartment",
      populate: {
        path: "user",
        select: "username email",
      },
    });
    res.json(departments);
  } catch (error) {
    console.error("Error in getDepartments:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (department) {
      department.name = req.body.name || department.name;
      department.description = req.body.description || department.description;
      department.headOfDepartment =
        req.body.headOfDepartment || department.headOfDepartment;

      const updatedDepartment = await department.save();
      res.json(updatedDepartment);
    } else {
      res.status(404).json({ message: "Department not found" });
    }
  } catch (error) {
    console.error("Error in updateDepartment:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (department) {
      await department.deleteOne();
      res.json({ message: "Department removed" });
    } else {
      res.status(404).json({ message: "Department not found" });
    }
  } catch (error) {
    console.error("Error in deleteDepartment:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
};
