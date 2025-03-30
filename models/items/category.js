import mongoose from "mongoose";
const categorySchema = mongoose.Schema({
  category_name: String,
  file_name: String,
});

export default mongoose.model("category", categorySchema);
