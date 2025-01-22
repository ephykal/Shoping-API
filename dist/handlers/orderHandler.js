"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderTotalSales = exports.countOrder = exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrderByUserId = exports.getOrderById = exports.getAllOrders = void 0;
const orderModel_1 = __importDefault(require("../model/orderModel"));
const orderItemModel_1 = __importDefault(require("../model/orderItemModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const Logger_1 = require("../library/Logger");
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderList = yield orderModel_1.default.find();
        return res.status(200).json(orderList);
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            details: error.message,
            success: false,
            message: "An error occurred while fetching a list of all orders",
        });
    }
});
exports.getAllOrders = getAllOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const order = yield orderModel_1.default.findById(id);
        // .populate("user", "name")
        // .populate({
        //   path: "orderItems",
        //   populate: { path: "product", populate: "category" },
        // });
        if (!order) {
            Logger_1.Logger.error("Order not found");
            return res.status(404).json("Order not found");
        }
        return res.status(200).json(order);
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(400).json({
            message: "Error in getting order with given ID",
            details: error.message,
        });
    }
});
exports.getOrderById = getOrderById;
const getOrderByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const existUser = yield userModel_1.default.exists({ _id: userId });
        if (!existUser) {
            Logger_1.Logger.error("User with the given Id not found");
            return res.status(404).json("User not found");
        }
        const order = yield orderModel_1.default.find({ user: userId })
            .populate("user", "name")
            .populate({
            path: "orderItems",
            populate: { path: "product", populate: "category" },
        });
        if (!order || order.length === 0) {
            Logger_1.Logger.error("No order found for the given user id");
            return res
                .status(404)
                .json("No order found for the user with the given user Id");
        }
        return res.status(200).json(order);
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            message: "An error occured while fetching orders with the given Id",
            details: error.message,
        });
    }
});
exports.getOrderByUserId = getOrderByUserId;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shippingAddress1, shippingAddress2, status, city, zip, country, phoneNo, user: userId, dateOrdered, } = req.body;
    // const userId: string = req.body.user;
    try {
        if (!Array.isArray(req.body.orderItems) ||
            req.body.orderItems.length === 0) {
            Logger_1.Logger.error("OrderItems is required and must be and array");
            return res.status(400).json({
                message: "Invalid orderItems",
                details: "OrderItems must be an array and can not be empty",
            });
        }
        const orderItemIds = yield Promise.all(req.body.orderItems.map((orderItem) => __awaiter(void 0, void 0, void 0, function* () {
            if (!orderItem.quantity || !orderItem.product) {
                Logger_1.Logger.error("Each orderItem must include quantity and product");
                throw new Error("Invalid order item:missing quantity or product");
            }
            const newOrderItem = new orderItemModel_1.default({
                quantity: orderItem.quantity,
                product: orderItem.product,
            });
            Logger_1.Logger.info(req.body.orderItem);
            yield newOrderItem.save();
            return newOrderItem._id;
        })));
        const totalPrices = yield Promise.all(orderItemIds.map((orderItemId) => __awaiter(void 0, void 0, void 0, function* () {
            const orderItem = yield orderItemModel_1.default.findById(orderItemId).populate("product", "price");
            if (!orderItem || !orderItem.product) {
                Logger_1.Logger.error("Order item or product not found");
                throw new Error("Invalid order item: missing quantity or product");
            }
            return orderItem.product.price * orderItem.quantity;
            // const totalPrice: number = orderItem.product.price * orderItem.quantity;
            // if (isNaN(totalPrice)) {
            //   Logger.error("Invalid total price");
            //   return res.status(400).json("Invalid total price");
            // }
            // return totalPrice;
        })));
        const existingUser = yield userModel_1.default.findById(userId);
        if (!existingUser) {
            Logger_1.Logger.error("Invalid user ID");
            return res.status(404).json("Invalid user ID");
        }
        if (existingUser.isAdmin) {
            return res.status(403).send("Forbidden: Admins can not create product");
        }
        const order = new orderModel_1.default({
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
        if (!orderItemIds &&
            !shippingAddress1 &&
            !status &&
            !city &&
            !country &&
            !phoneNo &&
            !existingUser._id) {
            Logger_1.Logger.error("orderItemIds, shippingAddress1, status, phoneNo, city, country, existingUser._id are all required ");
            return res
                .status(400)
                .json("orderItemIds, shippingAddress1, status, phoneNo, city, country, existingUser._id are all required ");
        }
        yield order.save();
        return res.status(201).json(order);
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            details: error.message,
            message: "order can not be created",
        });
    }
});
exports.createOrder = createOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status } = req.body;
    try {
        const order = yield orderModel_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            Logger_1.Logger.error("Order not found");
            return res.status(404).json("Order not found");
        }
        if (!status) {
            Logger_1.Logger.error("status are all required");
            return res.status(400).json("status are all required ");
        }
        Logger_1.Logger.info("Order successfully updated");
        return res
            .status(200)
            .json({ message: "Order successfully updated", order });
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            message: "Can't update order, an error occured",
            details: error.message,
        });
    }
});
exports.updateOrder = updateOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const order = yield orderModel_1.default.findByIdAndDelete(id);
        if (!order) {
            Logger_1.Logger.error("Order not found");
            return res.status(404).json("Order not found");
        }
        Logger_1.Logger.info("Successfully deleted");
        return res.status(200).json({ message: "order successfully deleted" });
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            message: "Can not delete order with the given Id",
            details: error.message,
        });
    }
});
exports.deleteOrder = deleteOrder;
const countOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Logger_1.Logger.info("Calling countOrder route");
    try {
        const orderCount = yield orderModel_1.default.countDocuments(); // Counts all orders
        res.status(200).json({ orderCount });
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        res.status(500).json({
            message: "An error occurred, order count could not be retrieved",
            details: error.message,
        });
    }
});
exports.countOrder = countOrder;
const orderTotalSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalSales = yield orderModel_1.default.aggregate([
            { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
        ]);
        if (!totalSales || totalSales.length === 0) {
            Logger_1.Logger.error("Order total sales cannot be generated");
            return res.status(404).json("Order total sales cannot be generated");
        }
        return res.status(200).json({ totalSales: totalSales[0].totalSales }); // Use totalSales[0] to access the result
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            message: "An error occurred while fetching order total sales",
            details: error.message,
        });
    }
});
exports.orderTotalSales = orderTotalSales;
