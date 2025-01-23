import express from "express";
import {
  getAllProduct,
  createProduct,
  getProductById,
  getProductByUserId,
  updateProduct,
  deleteProduct,
  featuredProduct,
  productCount,
} from "../handlers/productsHandler";
import validateObjectId from "../middleware/validateObjectId";
import authUser from "../middleware/auth";
import { validateProductInput } from "../middleware/validateData";

const router = express.Router();

router.get("/", getAllProduct);
router.get("/featured/", featuredProduct);
router.get("/count/", productCount);
router.get("/:id", validateObjectId, getProductById);
router.get("/user/:userId", validateObjectId, getProductByUserId);
router.post("/create-product", validateProductInput, authUser, createProduct);
router.put("/update-product/:id", validateObjectId, authUser, updateProduct);
router.delete("/delete-product/:id", authUser, validateObjectId, deleteProduct);

export default router;
