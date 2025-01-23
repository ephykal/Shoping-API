import express from "express";
import {
  createUser,
  getAllUser,
  getUserById,
  loginUser,
} from "../handlers/userHandler";
import validateObjectId from "../middleware/validateObjectId";
import { validateUserInput } from "../middleware/validateData";

const router = express.Router();

router.get("/", getAllUser);
router.get("/:id", validateObjectId, getUserById);
router.post("/register", validateUserInput, createUser);
router.post("/login", loginUser);

export default router;
