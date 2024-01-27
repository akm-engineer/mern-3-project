import React, { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { RiEdit2Line, RiDeleteBin6Line } from "react-icons/ri";

const ProductForm = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: "",
    packSize: "",
    category: "",
    mrp: "",
    status: "",
  });

  // State to manage selected file
  const [file, setFile] = useState(null);

  // State to manage product details for display
  const [productDetails, setProductDetails] = useState(null);

  // State to manage all products from the database
  const [allProducts, setAllProducts] = useState([]);

  // State to manage errors
  const [error, setError] = useState(null);

  //State to update Product
  const [selectedProductId, setSelectedProductId] = useState(null);
  // Function to handle image submission
  const handleImageSubmit = async () => {
    try {
      if (file) {
        // Upload image to storage and get download URL
        const url = await storageImage(file);

        // Update form data with image URL
        setFormData({
          ...formData,
          imageUrls: url,
        });
      } else {
        console.warn("No file selected.");
      }
    } catch (error) {
      console.error("Image upload failed:", error.message);
      setError("Image upload failed. Please try again.");
    }
  };

  // Function to upload image to storage and return download URL
  const storageImage = async (file) => {
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Event listeners for upload progress and completion
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            reject(error);
          },
          () => {
            // Once uploaded, get the download URL and resolve the promise
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });

      return getDownloadURL(uploadTask.snapshot.ref);
    } catch (error) {
      throw error;
    }
  };

  // Function to handle form submission

  // Function to fetch all products from the server
  const fetchAllProducts = async () => {
    try {
      const response = await fetch("/api/product/all");
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const products = await response.json();
      setAllProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleEdit = (productId) => {
    setSelectedProductId(productId);

    const selectedProduct = allProducts.find(
      (product) => product._id === productId
    );

    setFormData({
      name: selectedProduct.name,
      packSize: selectedProduct.packSize,
      category: selectedProduct.category,
      mrp: selectedProduct.mrp,
      status: selectedProduct.status,
    });

    setProductDetails({
      id: selectedProduct._id,
      name: selectedProduct.name,
      packSize: selectedProduct.packSize,
      category: selectedProduct.category,
      mrp: selectedProduct.mrp,
      status: selectedProduct.status,
      imageUrls: selectedProduct.imageUrls,
    });
  };

  // Function to handle deleting a product
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/product/delete/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }

      // Clear form data and selected file
      setFormData({
        name: "",
        packSize: "",
        category: "",
        mrp: "",
        status: "",
      });
      setFile(null);

      // Clear any previous error
      setError(null);

      // Fetch all products from the server
      fetchAllProducts();
    } catch (error) {
      console.error("Error deleting product:", error.message);
      setError("Error deleting product. Please try again.");
    }
  };
  const handleSubmit = async () => {
    try {
      // Send data to the server
      let method = "POST";
      let endpoint = "/api/product/create";

      if (selectedProductId) {
        method = "PUT";
        endpoint = `/api/product/update/${selectedProductId}`;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.statusText}`);
      }

      // Parse the response as JSON
      const product = await response.json();

      // Update product details for display
      setProductDetails({
        id: product._id,
        name: product.name,
        packSize: product.packSize,
        category: product.category,
        mrp: product.mrp,
        status: product.status,
        imageUrls: product.imageUrls,
      });

      // Clear form data
      setFormData({
        name: "",
        packSize: "",
        category: "",
        mrp: "",
        status: "",
      });

      // Clear file input
      setFile(null);

      // Clear any previous error
      setError(null);

      // Fetch all products from the server
      fetchAllProducts();
    } catch (error) {
      console.error("Error creating product:", error.message);
      setError("Error creating product. Please try again.");
    }
  };
  return (
    <>
      {/* Form for product details */}
      <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md mt-5">
        <h2 className="text-2xl font-semibold mb-4">Product Details</h2>

        {/* Display error, if any */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Form inputs */}
        <form className="space-y-4">
          {/* Name input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Pack Size input */}
          <div>
            <label
              htmlFor="packSize"
              className="block text-sm font-medium text-gray-600"
            >
              Pack Size
            </label>
            <input
              type="text"
              id="packSize"
              value={formData.packSize}
              onChange={(e) =>
                setFormData({ ...formData, packSize: e.target.value })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Category dropdown */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-600"
            >
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="milk">Milk</option>
              <option value="fruits">Fruits</option>
            </select>
          </div>

          {/* MRP input */}
          <div>
            <label
              htmlFor="mrp"
              className="block text-sm font-medium text-gray-600"
            >
              MRP
            </label>
            <input
              type="text"
              id="mrp"
              value={formData.mrp}
              onChange={(e) =>
                setFormData({ ...formData, mrp: e.target.value })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Image upload section */}
          <div className="flex gap-3">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-600"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              required
            />
            <button
              onClick={handleImageSubmit}
              type="button"
              className="bg-purple-500 p-1 text-white rounded"
            >
              Upload
            </button>
          </div>

          {/* Status dropdown */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-600"
            >
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit button */}
          <div>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              {selectedProductId ? "Update Product" : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Display product details if available */}
      <div>
        {productDetails && (
          <div className="mt-8 mb-3 p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
              Product Details:
            </h3>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Pack Size </th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">MRP </th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Image</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">{productDetails.id}</td>
                  <td className="border px-4 py-2">{productDetails.name}</td>
                  <td className="border px-4 py-2">
                    {productDetails.packSize} mL
                  </td>
                  <td className="border px-4 py-2">
                    {productDetails.category}
                  </td>
                  <td className="border px-4 py-2">₹{productDetails.mrp}</td>
                  <td
                    className={`border px-4 py-2 ${
                      productDetails.status === "active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {productDetails.status}
                  </td>
                  <td className="border px-4 py-2">
                    <img
                      src={productDetails.imageUrls}
                      alt="Product"
                      className="w-14 h-14 flex-shrink-0"
                    />
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(productDetails.id)}
                      disabled={productDetails.status === "inactive"}
                      className="text-blue-500 hover:underline"
                    >
                      <RiEdit2Line />
                    </button>
                    <button
                      onClick={() => handleDelete(productDetails.id)}
                      className="text-red-500 hover:underline"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Display all products */}
      <div className="mt-8 mb-3 p-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
          All Products:
        </h3>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Pack Size</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">MRP</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((product) => (
              <tr key={product._id}>
                <td className="border px-4 py-2">{product._id}</td>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.packSize} mL</td>
                <td className="border px-4 py-2">{product.category}</td>
                <td className="border px-4 py-2">₹{product.mrp}</td>
                <td
                  className={`border px-4 py-2 ${
                    product.status === "active"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {product.status}
                </td>
                <td className="border px-4 py-2">
                  <img
                    src={product.imageUrls}
                    alt="Product"
                    className="w-14 h-14 flex-shrink-0"
                  />
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(product._id)}
                    disabled={product.status === "inactive"}
                    className={`text-blue-500 hover:underline ${
                      product.status === "inactive" ? "text-gray-500" : ""
                    }`}
                  >
                    <RiEdit2Line />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:underline"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductForm;
