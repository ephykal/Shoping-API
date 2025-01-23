import express from "express";
import {
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  createOrder,
  countOrder,
  orderTotalSales,
  updateOrder,
  deleteOrder,
} from "../handlers/orderHandler";
import validateObjectId from "../middleware/validateObjectId";
import authUser from "../middleware/auth";
import { validateOrderInput } from "../middleware/validateData";

const router = express.Router();

router.get("/", authUser, getAllOrders);
router.get("/count-orders", authUser, countOrder);
router.get("/total-sales", authUser, orderTotalSales);
router.get("/:id", validateObjectId, getOrderById);
router.get("/user-order/:userId", validateObjectId, authUser, getOrderByUserId);
router.post("/create-order", validateOrderInput, authUser, createOrder);
router.put("/update-order/:id", validateObjectId, authUser, updateOrder);
router.delete("/delete-order/:id", validateObjectId, authUser, deleteOrder);

export default router;
