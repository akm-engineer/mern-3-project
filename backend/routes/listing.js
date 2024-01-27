import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../controllers/listing.js";

const productRouter = express.Router();

productRouter.post("/create", verifyToken, createProduct);
productRouter.delete("/delete/:id", verifyToken, deleteProduct);
productRouter.put("/update/:id", verifyToken, updateProduct);
productRouter.get("/all", verifyToken, getProduct);

export default productRouter;
