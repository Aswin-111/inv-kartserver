// server.js

import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import designerRoutes from "./routes/designer.routes.js";
import orderRoutes from "./routes/order.routes.js";
import "./config/db.js";
import { authMiddleware } from "./middleware/index.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use(
  "/category",
  express.static(path.join(__dirname, "uploads/categories"))
);
app.use("/products", express.static(path.join(__dirname, "uploads/products")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/users", userRoutes);
app.use("/products", authMiddleware, productRoutes);
app.use("/designing", authMiddleware, designerRoutes);
app.use("/orders", authMiddleware, orderRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: err.message || "An unexpected error occurred" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
