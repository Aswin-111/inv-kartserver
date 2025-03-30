import mongoose from "mongoose";

const leadSchema = mongoose.Schema({
  name: String,
  phone: String,
  leadowner: String,
  rating: String,
  status: {
    type: String,
    default: "New",
  },
  note: String,
  address: String,
});
export default mongoose.model("lead", leadSchema);
