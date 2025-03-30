import mongoose from "mongoose";

const printingTaskSchema = new mongoose.Schema({
  printing_taskid: {
    type: String,
    required: true,
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
    required: true,
  },

  approved_images: [
    {
      type: String, // Assuming URLs or file paths
    },
  ],
  lead_owner: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Hold", "Review", "Completed"],
    default: "Open",
  },
});

const Printing = mongoose.model("printing", printingTaskSchema);

module.exports = Printing;
