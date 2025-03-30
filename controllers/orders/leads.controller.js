import mongoose from "mongoose"; // Import mongoose for ObjectId validation and other operations;
import Leads from "../../models/orders/leads.js";
import Products from "../../models/items/products.js";
export const getLeads = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const leads = await Leads.find().skip(skip).limit(limit);
    const total = await Leads.countDocuments();

    res.status(200).json({
      status: "success",
      leads: leads,
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

export const getLeadDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const lead_details = await Leads.find({ _id: id });
    const product_details = await Products.find();
    res.status(200).json({
      status: "success",
      lead_details: lead_details,
      product_details: product_details,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createLead = async (req, res) => {
  // console.log(req.body);

  const { name, phone, rating, status, note } = req.body;

  console.log(name, phone, req.user, rating, status, note);

  try {
    // Check if leads with the same name already exists
    const existingLeads = await Leads.findOne({ phone });
    if (existingLeads) {
      return res.status(400).json({
        status: "error",
        message: "Leads name with phone already exists",
      });
    }

    // Create a new leads if it doesn't exist
    const newLeads = new Leads({
      name,
      phone,
      rating,
      status,
      note,
      leadowner: req.user,
    });

    await newLeads.save();

    return res.status(201).json({ status: "success", data: newLeads });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateLead = async (req, res) => {
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

export const deleteLead = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "product with id not found" });

  await Product.findByIdAndRemove(id);

  res.json({ message: "Product deleted successfully." });
};
