const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validateTaskCreate, validateTaskUpdate } = require('../middleware/validators');

// Public routes
router.get('/', getTasks);
router.get('/:id', getTask);

// Protected routes (require authentication)
router.post('/', protect, validateTaskCreate, createTask);
router.put('/:id', protect, validateTaskUpdate, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
