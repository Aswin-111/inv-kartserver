import mongoose from "mongoose"; // Import mongoose for ObjectId validation and other operations
import Product from "../../models/items/products.js";
export const getAllProducts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();

    res.status(200).json({
      status: "success",
      data: products,
      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = req.body;
    const { filename } = req.file;

    const {
      productName,
      sku,
      productCategory,
      mrp,
      sellingPrice,
      shape,
      size,
      thickness,
    } = product;

    // Check if the product with the same name already exists
    const existingProduct = await Product.findOne({ product_name: productName });
    if (existingProduct) {
      return res.status(400).json({ status: "error", message: "Product name already exists" });
    }

    // Create a new product if it doesn't exist
    const newProduct = new Product({
      product_name: productName,
      sku,
      mrp,
      price: sellingPrice,
      file_name: filename,
      shape,
      size,
      thickness,
      category: productCategory,
    });

    await newProduct.save();

    res.status(201).json({ status: "success", data: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};


export const updateProduct = async (req, res) => {
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
  await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
  return res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "product with id not found" });

  await Product.findByIdAndRemove(id);

  res.json({ message: "Product deleted successfully." });
};
