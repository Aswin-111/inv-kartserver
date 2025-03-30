const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskname: { type: String, required: true },
  leadname: { type: String, required: true },
  timeperiod: { type: Date, required: true },
  activitytype: { type: String, required: true },
  priority: { type: String, required: true },
  note: { type: String, required: true },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
