import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  product_name: String,
  sku: String,
  mrp: String,
  shape: String,
  file_name: String,
  size: String,
  shapes: String,
  thickness: String,
  price: String,
  status: {
    type: String,
    default: "active",
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
});
export default mongoose.model("Product", productSchema);
