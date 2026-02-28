const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// @desc    Mark attendance (Check-in/Check-out)
// @route   POST /api/attendance
// @access  Private (Employee/Admin)
const markAttendance = async (req, res) => {
  try {
    const { employeeId, status, checkIn, checkOut, date } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recordDate = date ? new Date(date) : today;

    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: {
        $gte: recordDate,
        $lt: new Date(recordDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (checkIn) {
      if (attendance) {
        return res
          .status(400)
          .json({ message: "Attendance already marked for today" });
      }
      attendance = await Attendance.create({
        employee: employeeId,
        date: recordDate,
        checkInTime: new Date(),
        status: "Present",
      });
    } else if (checkOut) {
      if (!attendance) {
        return res
          .status(404)
          .json({ message: "No check-in record found for today" });
      }
      attendance.checkOutTime = new Date();
      await attendance.save();
    } else {
      if (attendance) {
        attendance.status = status || attendance.status;
        attendance.checkInTime = req.body.checkInTime || attendance.checkInTime;
        attendance.checkOutTime =
          req.body.checkOutTime || attendance.checkOutTime;
        await attendance.save();
      } else {
        attendance = await Attendance.create({
          employee: employeeId,
          date: recordDate,
          checkInTime: req.body.checkInTime,
          checkOutTime: req.body.checkOutTime,
          status: status || "Absent",
        });
      }
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error in markAttendance:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance history
// @route   GET /api/attendance/:employeeId
// @access  Private
const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      employee: req.params.employeeId,
    })
      .populate({
        path: "employee",
        populate: { path: "user", select: "username email" },
      })
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    console.error("Error in getAttendance:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attendance (Admin)
// @route   GET /api/attendance
// @access  Private/Admin
const getAllAttendance = async (req, res) => {
  try {
    const { date, department, startDate, endDate } = req.query;
    let query = {};

    if (date) {
      const queryDate = new Date(date);
      query.date = {
        $gte: queryDate,
        $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lt = new Date(
          new Date(endDate).getTime() + 24 * 60 * 60 * 1000,
        );
      }
    }

    if (department) {
      const employees = await Employee.find({
        department: department,
      });
      const employeeIds = employees.map((emp) => emp._id);
      query.employee = { $in: employeeIds };
    }

    const attendance = await Attendance.find(query)
      .populate({
        path: "employee",
        populate: {
          path: "user department",
          select: "username email name",
        },
      })
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error("Error in getAllAttendance:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Admin
const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (attendance) {
      attendance.status = req.body.status || attendance.status;
      attendance.checkInTime = req.body.checkInTime || attendance.checkInTime;
      attendance.checkOutTime =
        req.body.checkOutTime || attendance.checkOutTime;
      attendance.remarks = req.body.remarks || attendance.remarks;

      await attendance.save();
      res.json(attendance);
    } else {
      res.status(404).json({ message: "Attendance record not found" });
    }
  } catch (error) {
    console.error("Error in updateAttendance:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (attendance) {
      await attendance.deleteOne();
      res.json({ message: "Attendance record removed" });
    } else {
      res.status(404).json({ message: "Attendance record not found" });
    }
  } catch (error) {
    console.error("Error in deleteAttendance:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
};
