const mongoose = require("../config");

const itemSchema = mongoose.Schema({
  name: String,
  category: String,
  sku: String,
  mrp: Number,
  selling_price: Number,
  products_photos: String,
  shapes: String,
  size: String,
  thickness: String,

  status: {
    type: String,
    default: "active",
  },
});
export default mongoose.model("stocks", itemSchema);
