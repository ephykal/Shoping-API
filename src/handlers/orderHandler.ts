import { Request, Response } from "express";
import Order, { IOrder } from "../model/orderModel";
import OrderItem from "../model/orderItemModel";
import User from "../model/userModel";
import { Logger } from "../library/Logger";

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orderList: IOrder[] = await Order.find();
    return res.status(200).json(orderList);
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      details: (error as Error).message,
      success: false,
      message: "An error occurred while fetching a list of all orders",
    });
  }
};

const getOrderById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const order = await Order.findById(id);
    // .populate("user", "name")
    // .populate({
    //   path: "orderItems",
    //   populate: { path: "product", populate: "category" },
    // });

    if (!order) {
      Logger.error("Order not found");
      return res.status(404).json("Order not found");
    }

    return res.status(200).json(order);
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(400).json({
      message: "Error in getting order with given ID",
      details: (error as Error).message,
    });
  }
};

const getOrderByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const existUser = await User.exists({ _id: userId });
    if (!existUser) {
      Logger.error("User with the given Id not found");
      return res.status(404).json("User not found");
    }

    const order = await Order.find({ user: userId })
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });

    if (!order || order.length === 0) {
      Logger.error("No order found for the given user id");
      return res
        .status(404)
        .json("No order found for the user with the given user Id");
    }

    return res.status(200).json(order);
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      message: "An error occured while fetching orders with the given Id",
      details: (error as Error).message,
    });
  }
};

const createOrder = async (req: Request, res: Response) => {
  const {
    shippingAddress1,
    shippingAddress2,
    status,
    city,
    zip,
    country,
    phoneNo,
    user: userId,
    dateOrdered,
  } = req.body;

  // const userId: string = req.body.user;

  try {
    if (
      !Array.isArray(req.body.orderItems) ||
      req.body.orderItems.length === 0
    ) {
      Logger.error("OrderItems is required and must be and array");
      return res.status(400).json({
        message: "Invalid orderItems",
        details: "OrderItems must be an array and can not be empty",
      });
    }

    const orderItemIds: string[] = await Promise.all(
      req.body.orderItems.map(
        async (orderItem: { quantity: number; product: string }) => {
          if (!orderItem.quantity || !orderItem.product) {
            Logger.error("Each orderItem must include quantity and product");
            throw new Error("Invalid order item:missing quantity or product");
          }

          const newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product,
          });
          Logger.info(req.body.orderItem);
          await newOrderItem.save();
          return newOrderItem._id;
        }
      )
    );

    const totalPrices: number[] = await Promise.all(
      orderItemIds.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        if (!orderItem || !orderItem.product) {
          Logger.error("Order item or product not found");
          throw new Error("Invalid order item: missing quantity or product");
        }
        return orderItem.product.price * orderItem.quantity;
        // const totalPrice: number = orderItem.product.price * orderItem.quantity;
        // if (isNaN(totalPrice)) {
        //   Logger.error("Invalid total price");
        //   return res.status(400).json("Invalid total price");
        // }
        // return totalPrice;
      })
    );

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      Logger.error("Invalid user ID");
      return res.status(404).json("Invalid user ID");
    }
    if (existingUser.isAdmin) {
      return res.status(403).send("Forbidden: Admins can not create product");
    }

    const order = new Order({
      orderItems: orderItemIds,
      shippingAddress1,
      shippingAddress2,
      status,
      city,
      zip,
      country,
      phoneNo,
      totalPrice: totalPrices.reduce((a, b) => a + b, 0),
      user: existingUser._id,
      dateOrdered,
    });

    if (
      !orderItemIds &&
      !shippingAddress1 &&
      !status &&
      !city &&
      !country &&
      !phoneNo &&
      !existingUser._id
    ) {
      Logger.error(
        "orderItemIds, shippingAddress1, status, phoneNo, city, country, existingUser._id are all required "
      );
      return res
        .status(400)
        .json(
          "orderItemIds, shippingAddress1, status, phoneNo, city, country, existingUser._id are all required "
        );
    }

    await order.save();
    return res.status(201).json(order);
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      details: (error as Error).message,
      message: "order can not be created",
    });
  }
};

const updateOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      Logger.error("Order not found");
      return res.status(404).json("Order not found");
    }
    if (!status) {
      Logger.error("status are all required");
      return res.status(400).json("status are all required ");
    }
    Logger.info("Order successfully updated");
    return res
      .status(200)
      .json({ message: "Order successfully updated", order });
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      message: "Can't update order, an error occured",
      details: (error as Error).message,
    });
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      Logger.error("Order not found");
      return res.status(404).json("Order not found");
    }
    Logger.info("Successfully deleted");
    return res.status(200).json({ message: "order successfully deleted" });
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      message: "Can not delete order with the given Id",
      details: (error as Error).message,
    });
  }
};

const countOrder = async (req: Request, res: Response): Promise<void> => {
  Logger.info("Calling countOrder route");
  try {
    const orderCount = await Order.countDocuments(); // Counts all orders
    res.status(200).json({ orderCount });
  } catch (error) {
    Logger.error((error as Error).message, error);
    res.status(500).json({
      message: "An error occurred, order count could not be retrieved",
      details: (error as Error).message,
    });
  }
};

const orderTotalSales = async (req: Request, res: Response) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);

    if (!totalSales || totalSales.length === 0) {
      Logger.error("Order total sales cannot be generated");
      return res.status(404).json("Order total sales cannot be generated");
    }

    return res.status(200).json({ totalSales: totalSales[0].totalSales }); // Use totalSales[0] to access the result
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      message: "An error occurred while fetching order total sales",
      details: (error as Error).message,
    });
  }
};

export {
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  createOrder,
  updateOrder,
  deleteOrder,
  countOrder,
  orderTotalSales,
};
