const express = require('express');
const router = express.Router();
const Task = require('../task'); // Assuming Task model is defined in task.js

// Get all tasks
router.get('/getalltasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a task
router.post('/deletetask', async (req, res) => {
  try {
    const { id } = req.body;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark a task as done
router.post('/marktaskdone', async (req, res) => {
  try {
    const { id } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.isDone = true;
    task.status = 'Done'; // Update the status field
    await task.save();
    res.json({ message: 'Task marked as done successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
