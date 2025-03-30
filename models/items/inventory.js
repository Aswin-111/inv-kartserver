import mongoose from "mongoose";

const inventorySchema = mongoose.Schema({
  material_name: String,
  product_category: String,
  unit: String,
  qty: String,
});

export default mongoose.model("inventory", inventorySchema);
