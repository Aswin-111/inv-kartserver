import mongoose from "mongoose"; // Import mongoose for ObjectId validation and other operations
import Category from "../../models/items/category.js";
export const getCategory = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const category = await Category.find().skip(skip).limit(limit);
    const total = await Category.countDocuments();

    res.status(200).json({
      status: "success",
      data: category,
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

export const createCategory = async (req, res) => {
  const { categoryName } = req.body;
  const { filename } = req.file;

  try {
    // Check if category with the same name already exists
    const existingCategory = await Category.findOne({
      category_name: categoryName,
    });
    if (existingCategory) {
      return res
        .status(400)
        .json({ status: "error", message: "Category name already exists" });
    }

    // Create a new category if it doesn't exist
    const newCategory = new Category({
      category_name: categoryName,
      file_name: filename,
    });

    await newCategory.save();

    return res.status(201).json({ status: "success", data: newCategory });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateCategory = async (req, res) => {
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

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "product with id not found" });

  await Product.findByIdAndRemove(id);

  res.json({ message: "Product deleted successfully." });
};
