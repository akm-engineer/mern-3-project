// models/Product.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["milk", "fruits"],
  },
  mrp: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
  },
  packSize: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
