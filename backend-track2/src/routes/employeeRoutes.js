const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');
const { validateEmployeeCreate, validateEmployeeUpdate } = require('../middleware/validators');

router.route('/').get(getEmployees).post(protect, validateEmployeeCreate, createEmployee);

router
  .route('/:id')
  .get(getEmployee)
  .put(protect, validateEmployeeUpdate, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;
