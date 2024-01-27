// controllers/categoryController.js

import Category from "../models/categories.js";

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  const { categoryName, description, status } = req.body;

  try {
    const newCategory = new Category({
      categoryName,
      description,
      status,
    });

    const savedCategory = await newCategory.save();
    res.json(savedCategory);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { categoryName, description, status } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        categoryName,
        description,
        status,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
