const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, 
  name: { type: String }, 
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
