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
exports.orderCreationMiddleware = exports.allOrderMiddleware = void 0;
const orderModel_1 = __importDefault(require("../model/orderModel"));
const Logger_1 = require("../library/Logger");
const allOrderMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderList = yield orderModel_1.default.find();
        res.locals.orderList = orderList;
        next();
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res.status(500).json({ error: error.message, success: false });
    }
});
exports.allOrderMiddleware = allOrderMiddleware;
const orderCreationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderItems, shippingAddress1, shippingAddress2, status, city, zip, country, phoneNo, } = req.body;
    try {
        const order = new orderModel_1.default({
            orderItems,
            shippingAddress1,
            shippingAddress2,
            status,
            city,
            zip,
            country,
            phoneNo,
        });
        const createdOrder = yield order.save();
        res.locals.createdOrder = createdOrder;
        next();
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res.status(500).json({
            error: error.message,
            message: "order can not be created",
            success: false,
        });
    }
});
exports.orderCreationMiddleware = orderCreationMiddleware;
