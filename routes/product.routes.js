import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/product/category.controller.js";
import {
  getInventory,
  createInventory,
  deleteInventory,
  updateInventory,
} from "../controllers/product/inventory.controller.js";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product/products.controller.js";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = path.join(__dirname, "..", "uploads");

    if (req.originalUrl.includes("/category") && req.method === "POST") {
      dest = path.join(dest, "categories");
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
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeFilename = file.originalname
      .replace(/[^a-z0-9.]/gi, "_")
      .toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(safeFilename)}`);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, PNG, and WEBP image files are allowed!"),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit
});

// Multer Error Handler
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer Error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

router
  .route("/category")
  .get(getCategory)
  .post(upload.single("categoryImage"), uploadErrorHandler, createCategory)
  .delete(deleteCategory)
  .patch(updateCategory); // Use PATCH for updates

router
  .route("/products")
  .get(getAllProducts)
  .post(upload.single("productPhoto"), uploadErrorHandler, createProduct)
  .delete(deleteProduct)
  .patch(updateProduct); // Use PATCH for updates

router
  .route("/inventory")
  .get(getInventory)
  .post(upload.single("inventoryImage"), uploadErrorHandler, createInventory)
  .delete(deleteInventory)
  .patch(updateInventory); // Use PATCH for updates

export default router;
