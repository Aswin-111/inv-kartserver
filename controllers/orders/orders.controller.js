import mongoose from "mongoose";

import Orders from "../../models/orders/orders.js";
import Users from "../../models/user/user.js";
import Leads from "../../models/orders/leads.js";
// export const getInventory = async (req, res) => {
//   try {
//     const products = await Inventory.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

export const createOrder = async (req, res) => {
  try {
    const product = req.body;

    console.log("Product order_id:", product.order_id);
    // console.log("Final orderId in order_details:", order_details.orderId);
    if (!product.order_id) {
      return res.status(400).json({ message: "Order ID is missing" });
    }

    const order_details = {
      orderId: product.order_id,
      userId: req.user,
      customerId: product.lead_id,
      address: product.address,
      products: [product.product_id],

      filenames: req.files.map((file) => file.filename),
      phone: product.phone,
    };
    console.log(order_details);

    const user = await Users.findOne({ _id: req.user });
    const lead = await Leads.findOne({ _id: product.lead_id });
    const username = user.name;

    const leadname = lead.name;
    const order = new Orders({
      orderId: product.order_id,
      ...order_details,
      leadOwner: username,
      leadName: leadname,
    });

    await order.save();

    res.status(201).json({ status: "success", order });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export const assignOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.body;
    console.log("orderId:", orderId, "userId:", userId);
    if (!orderId || !userId) {
      return res
        .status(400)
        .json({ message: "orderId and userId are required" });
    }
    const or_data = await Orders.findOne({ _id: orderId });

    console.log("or_data:", or_data);
    const order = await Orders.findOneAndUpdate(
      { _id: orderId },
      { assignedTo: userId, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ status: "success", assignedOrder: order });
  } catch (error) {
    console.error("Error assigning order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllOrders = async (req, res) => {
  console.log("get all orders");
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const orders = await Orders.find().skip(skip).limit(limit);
    const total = await Orders.countDocuments();

    res.status(200).json({
      status: "success",
      data: orders,
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

export const getAllUsers = async (req, res) => {
  console.log("get all orders", req.params.role);
  try {
    const users = await Users.find();

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
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
