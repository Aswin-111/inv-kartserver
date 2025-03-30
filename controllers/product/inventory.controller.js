import mongoose from "mongoose"; // Import mongoose for ObjectId validation and other operations
import Inventory from "../../models/items/inventory.js";
export const getInventory = async (req, res) => {
  try {
    const products = await Inventory.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createInventory = async (req, res) => {
  const product = req.body;

  const newProduct = new Inventory(product);
  try {
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { product_name, description, price, category } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No product with id: ${id}`);

  const updatedProduct = {
    product_name,
    description,
    price,
    category,
    _id: id,
  };
  await Inventory.findByIdAndUpdate(id, updatedProduct, { new: true });
  return res.json(updatedProduct);
};

export const deleteInventory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "product with id not found" });

  await Inventory.findByIdAndRemove(id);

  res.json({ message: "Product deleted successfully." });
};
