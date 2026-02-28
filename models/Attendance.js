const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    status: { type: String, enum: ['Present', 'Absent', 'Leave', 'Half-day'], default: 'Absent' },
    remarks: { type: String }
}, { timestamps: true });

// Ensure one record per employee per day? Or just handle in logic.
// Unique compound index might be good but Date handling can be tricky.
attendanceSchema.index({ employee: 1, date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
