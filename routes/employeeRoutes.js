const express = require('express');
const router = express.Router();
const {
    addEmployee,
    getEmployees,
    getEmployeeById,
    getEmployeeProfile,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/profile', protect, getEmployeeProfile);

router.route('/')
    .get(protect, adminOnly, getEmployees)
    .post(protect, adminOnly, addEmployee);

router.route('/:id')
    .get(protect, getEmployeeById) // Add check if user is accessing their own profile
    .put(protect, adminOnly, updateEmployee)
    .delete(protect, adminOnly, deleteEmployee);

module.exports = router;
