import express from "express";
import validateObjectId from "../middleware/validateObjectId";
import authUser from "../middleware/auth";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomer,
  getAllCustomerById,
  updateCustomer,
} from "../handlers/customerHandler";
import { validateCustomerInput } from "../middleware/validateData";

const router = express.Router();

router.get("/", getAllCustomer);
router.get("/:id", validateObjectId, getAllCustomerById);
router.post("/create-customer", validateCustomerInput, createCustomer);
router.put("/update-customer/:id", validateObjectId, authUser, updateCustomer);
router.delete(
  "/delete-customer/:id",
  validateObjectId,
  authUser,
  deleteCustomer
);

export default router;
