// routes/product.routes.js

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  getLeads,
  createLead,
  deleteLead,
  updateLead,
  getLeadDetails,
} from "../controllers/orders/leads.controller.js";
import {
  createOrder,
  getAllOrders,
  getAllUsers,
  assignOrder,
} from "../controllers/orders/orders.controller.js";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/orders/tasks.controller.js";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = path.join(__dirname, "..", "uploads");

    if (req.originalUrl.includes("/orders") && req.method === "POST") {
      dest = path.join(dest, "orders");
    } else if (req.originalUrl.includes("/products") && req.method === "POST") {
      dest = path.join(dest, "products");
    } else if (
      req.originalUrl.includes("/inventory") &&
      req.method === "POST"
    ) {
      dest = path.join(dest, "inventory", req.body.inventoryId || "");
    }

    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeFilename = file.originalname
      .replace(/[^a-z0-9.]/gi, "_")
      .toLowerCase();
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(safeFilename));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit
});

router
  .route("/leads")
  .get(getLeads)
  .post(createLead)
  .delete(deleteLead)
  .put(updateLead);

router.get("/getleaddetails/:id", getLeadDetails);

router
  .route("/order")
  .get((req, res, next) => {
    console.log("get all orders");
    next();
  }, getAllOrders)
  .post(upload.array("productPhoto"), createOrder)
  .delete(deleteProduct)
  .put(updateProduct);
router.get("/getalluserbyrole/:role", getAllUsers);

router.post("/assignorder", assignOrder);
// router
//   .route("/inventory")
//   .get(getInventory)
//   .post(upload.single("inventoryImage"), createInventory)
//   .delete(deleteInventory)
//   .put(updateInventory);

export default router;
