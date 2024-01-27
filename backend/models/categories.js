// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
