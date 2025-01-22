import express from "express";
import {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../handlers/categoryHandler";
import validateObjectId from "../middleware/validateObjectId";
import authUser from "../middleware/auth";
import { validateCategoryInput } from "../middleware/validateData";

const router = express.Router();

router.get("/", getAllCategory);
router.get("/:id", validateObjectId, getCategoryById);
router.post("/create-category", validateCategoryInput, createCategory);
router.put("/update-category/:id", validateObjectId, authUser, updateCategory);
router.delete(
  "/delete-category/:id",
  validateObjectId,
  authUser,
  deleteCategory
);

export default router;
