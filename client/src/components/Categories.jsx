import React, { useState, useEffect } from "react";

// Replace with your backend URL

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/category/all`);
      const data = await response.json();

      if (response.ok) {
        setCategories(data);
      } else {
        console.error(
          "Error fetching categories:",
          data.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const handleEdit = (categoryId) => {
    // Set the selected category ID for editing
    setSelectedCategoryId(categoryId);

    // Find the category by ID
    const selectedCategory = categories.find(
      (category) => category._id === categoryId
    );

    // Populate the form fields with the selected category's data
    setCategoryName(selectedCategory.categoryName);
    setDescription(selectedCategory.description);
    setStatus(selectedCategory.status);
  };

  const handleDelete = async (categoryId) => {
    try {
      // Make a DELETE request to the backend
      const response = await fetch(`/api/category/delete/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      // Handle unsuccessful category deletion
      if (!response.ok) {
        setError(data.error || "Error deleting category. Please try again.");
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }

      // Handle successful category deletion
      setError(null);
      console.log("Category deleted successfully:", data);

      // Update the state by removing the deleted category
      setCategories(
        categories.filter((category) => category._id !== categoryId)
      );
    } catch (error) {
      setError("Error deleting category. Please try again.");
      console.error("Error deleting category:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let method = "POST";
      let endpoint = `api/category/create`;

      // If editing, use PUT request instead of POST
      if (selectedCategoryId) {
        method = "PUT";
        endpoint = `api/category/update/${selectedCategoryId}`;
      }

      // Make a POST or PUT request to the backend
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName,
          description,
          status,
        }),
      });

      const data = await response.json();

      // Handle unsuccessful category creation/update
      if (!response.ok) {
        setError(data.error || "Error saving category. Please try again.");
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }

      // Handle successful category creation/update
      setError(null);
      console.log("Category saved successfully:", data);

      // Update the state with the new/updated category
      const updatedCategories = selectedCategoryId
        ? categories.map((category) =>
            category._id === selectedCategoryId ? data : category
          )
        : [...categories, data];

      setCategories(updatedCategories);

      // Clear the form fields and reset selectedCategoryId
      setCategoryName("");
      setDescription("");
      setStatus("");
      setSelectedCategoryId(null);
    } catch (error) {
      setError("Error saving category. Please try again.");
      console.error("Error saving category:", error.message);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add Category</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="categoryName"
              className="block text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              className="mt-1 p-2 border rounded-md w-full"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="mt-1 p-2 border rounded-md w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full border rounded-md p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-purple-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            {selectedCategoryId ? "Update Category" : "Save Category"}
          </button>
        </form>
      </div>
      {/* Display Categories in a Table */}
      <div className="mt-8 p-5 rounded">
        <h2 className="text-2xl font-bold mb-8 text-center ">Categories</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="border-b py-2">#</th>
                <th className="border-b py-2">Name</th>
                <th className="border-b py-2">Description</th>
                <th className="border-b py-2">Status</th>
                <th className="border-b py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category._id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="border px-4 py-2">{category._id}</td>
                  <td className="border px-4 py-2">{category.categoryName}</td>
                  <td className="border px-4 py-2">{category.description}</td>
                  <td
                    className={`border px-4 py-2 ${
                      category.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {category.status}
                  </td>
                  <td className="border px-4 py-2 ">
                    <button
                      className={`${
                        category.status === "inactive"
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                          : "bg-blue-500 text-white"
                      } p-2 rounded-md hover:bg-blue-600 transition duration-300 mr-2`}
                      onClick={() => handleEdit(category._id)}
                      disabled={category.status === "inactive"}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Categories;
