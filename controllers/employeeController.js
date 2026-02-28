const Employee = require("../models/Employee");
const User = require("../models/User");

// @desc    Add a new employee (creates User + Employee profile)
// @route   POST /api/employees
// @access  Private/Admin
const addEmployee = async (req, res) => {
  const {
    username,
    email,
    password,
    role, // User data
    department,
    designation,
    salary,
    dateOfJoining,
    phone,
    address, // Employee data
  } = req.body;

  try {
    // 1. Create User
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User (Email) already exists" });
    }

    const user = await User.create({
      username,
      email,
      password: password || "123456", // Default password if not provided
      role: role || "Employee",
    });

    // 2. Create Employee Profile
    const employee = await Employee.create({
      user: user._id,
      department,
      designation,
      salary,
      dateOfJoining,
      phone,
      address,
    });

    res.status(201).json({
      message: "Employee created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      employee,
    });
  } catch (error) {
    console.error("Error in addEmployee:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("user", "username email role")
      .populate("department", "name");
    res.json(employees);
  } catch (error) {
    console.error("Error in getEmployees:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private (Admin or Self)
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("user", "-password")
      .populate("department");

    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error in getEmployeeById:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      // Update simple fields
      employee.department = req.body.department || employee.department;
      employee.designation = req.body.designation || employee.designation;
      employee.salary = req.body.salary || employee.salary;
      employee.phone = req.body.phone || employee.phone;
      employee.address = req.body.address || employee.address;
      employee.isActive =
        req.body.isActive !== undefined ? req.body.isActive : employee.isActive;

      await employee.save();
      res.json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error in updateEmployee:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete employee (and user)
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      // Also delete the associated User
      await User.findByIdAndDelete(employee.user);
      await employee.deleteOne();
      res.json({ message: "Employee and User account removed" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error in deleteEmployee:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current employee profile
// @route   GET /api/employees/profile
// @access  Private
const getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id })
      .populate("user", "-password")
      .populate("department");

    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: "Employee profile not found" });
    }
  } catch (error) {
    console.error("Error in getEmployeeProfile:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeProfile,
  updateEmployee,
  deleteEmployee,
};
