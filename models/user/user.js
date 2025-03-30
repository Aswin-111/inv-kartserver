import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: String,
});

const User = mongoose.model("Users", userSchema);

export default User;
