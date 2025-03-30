import mongoose from "mongoose";

const designTaskSchema = new mongoose.Schema({
  task_id: {
    type: String,
    required: true,
    unique: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  original_images: [
    {
      type: String, // Assuming URLs or file paths
    },
  ],
  edited_images: [
    {
      type: String, // Assuming URLs or file paths
    },
  ],
  lead_owner: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Hold", "Review", "Closed", "Reassigned"],
    default: "Open",
  },
});

const Designing = mongoose.model("designing", designTaskSchema);

module.exports = Designing;
