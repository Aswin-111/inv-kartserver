import mongoose from "mongoose";

const db = mongoose.connect("mongodb://localhost:27017/inv-kart");

export default db;
