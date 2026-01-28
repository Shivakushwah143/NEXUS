import mongoose from "mongoose";

const PorductSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  image: { type: String },
  colour: { type: String },
  size: { type: [String] },
});

export const Product = mongoose.model("Product", PorductSchema);

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String, required: true }, 
  avtar: { type: String }, 
  otp: { type: String },               
  otpExpiry: { type: Date },   
   verified: { type: Boolean, default: false },
  purchaseProduct: [{ type: mongoose.Types.ObjectId, ref: "Product"}]
});

export const User = mongoose.model("User", userSchema);


const adminSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String , default: null },
});

export const admin = mongoose.model("admin", adminSchema);
