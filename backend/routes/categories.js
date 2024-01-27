// routes/categoryRoutes.js
import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categories.js";

const categoryRouter = express.Router();

// Get all categories
categoryRouter.get("/all", getAllCategories);

// Create a new category
categoryRouter.post("/create", createCategory);

// Update a category by ID
categoryRouter.put("/update/:id", updateCategory);

// Delete a category by ID
categoryRouter.delete("/delete/:id", deleteCategory);

export default categoryRouter;
