const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");

// @desc    Generate Payroll for an employee
// @route   POST /api/payroll
// @access  Private/Admin
const generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year } = req.body;
    let { allowances, deductions } = req.body;

    allowances = Number(allowances) || 0;
    deductions = Number(deductions) || 0;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const existingPayroll = await Payroll.findOne({
      employee: employeeId,
      month,
      year,
    });
    if (existingPayroll) {
      return res
        .status(400)
        .json({ message: "Payroll for this month already exists" });
    }

    const basicSalary = employee.salary || 0;
    const netSalary = basicSalary + allowances - deductions;

    const payroll = await Payroll.create({
      employee: employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      status: "Pending",
    });

    res.status(201).json(payroll);
  } catch (error) {
    console.error("Error in generatePayroll:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Payroll Records
// @route   GET /api/payroll
// @access  Private (Admin/Employee)
const getPayroll = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;
    let query = {};

    if (employeeId) query.employee = employeeId;
    if (month) query.month = month;
    if (year) query.year = year;

    if (req.user.role === "Employee") {
      const emp = await Employee.findOne({ user: req.user._id });
      if (!emp)
        return res.status(404).json({ message: "Employee profile not found" });
      query.employee = emp._id;
    }

    const payrolls = await Payroll.find(query)
      .populate({
        path: "employee",
        populate: { path: "user", select: "username email" },
      })
      .sort({ year: -1, month: -1 });

    res.json(payrolls);
  } catch (error) {
    console.error("Error in getPayroll:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payroll by ID
// @route   GET /api/payroll/:id
// @access  Private
const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate({
      path: "employee",
      populate: { path: "user", select: "username email" },
    });

    if (payroll) {
      res.json(payroll);
    } else {
      res.status(404).json({ message: "Payroll not found" });
    }
  } catch (error) {
    console.error("Error in getPayrollById:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update payroll
// @route   PUT /api/payroll/:id
// @access  Private/Admin
const updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (payroll) {
      payroll.basicSalary = req.body.basicSalary || payroll.basicSalary;
      payroll.allowances = req.body.allowances || payroll.allowances;
      payroll.deductions = req.body.deductions || payroll.deductions;
      payroll.netSalary =
        req.body.netSalary ||
        payroll.basicSalary + payroll.allowances - payroll.deductions;
      payroll.status = req.body.status || payroll.status;
      payroll.paymentDate = req.body.paymentDate || payroll.paymentDate;

      await payroll.save();
      res.json(payroll);
    } else {
      res.status(404).json({ message: "Payroll not found" });
    }
  } catch (error) {
    console.error("Error in updatePayroll:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark payroll as paid
// @route   PUT /api/payroll/:id/pay
// @access  Private/Admin
const markAsPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (payroll) {
      payroll.status = "Paid";
      payroll.paymentDate = req.body.paymentDate || new Date();

      await payroll.save();
      res.json({
        message: "Payroll marked as paid",
        payroll,
      });
    } else {
      res.status(404).json({ message: "Payroll not found" });
    }
  } catch (error) {
    console.error("Error in markAsPaid:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete payroll
// @route   DELETE /api/payroll/:id
// @access  Private/Admin
const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (payroll) {
      await payroll.deleteOne();
      res.json({ message: "Payroll removed" });
    } else {
      res.status(404).json({ message: "Payroll not found" });
    }
  } catch (error) {
    console.error("Error in deletePayroll:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generatePayroll,
  getPayroll,
  getPayrollById,
  updatePayroll,
  markAsPaid,
  deletePayroll,
};
