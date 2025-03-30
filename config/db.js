import mongoose from "mongoose";
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/inv_kart";

mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));
