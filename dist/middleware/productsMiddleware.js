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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const productsModel_1 = __importDefault(require("../model/productsModel"));
const Logger_1 = require("../library/Logger");
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, "my-jwt-secret");
            const userId = decoded.userId;
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                return res.status(401).send({ message: "Unauthorized ID" });
            }
            req.user = user;
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Expired Token" });
        }
    }
    catch (error) {
        console.log("Failed to authenticate", error);
        res.status(500).json({ message: "Failed to authenticate" });
    }
});
const allProductsMiddlware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsList = yield productsModel_1.default.find();
        res.locals.productsList = productsList;
        next();
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res
            .status(500)
            .json({ error: error.message, message: "Failed to fetch products" });
    }
});
const productsByUserIdMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const productsById = yield productsModel_1.default.find({ user: userId });
        res.locals.productsById = productsById;
        next();
    }
    catch (error) {
        Logger_1.Logger.error(console.error());
        return res.status(500).json({
            error: error.message,
            message: `Can not fetch products posted by ${userId}`,
        });
    }
});
const productsCreationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, user } = req.body;
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        const product = new productsModel_1.default({ name, description, price, user: userId });
        const createdProduct = yield product.save();
        res.locals.createdProduct = createdProduct;
        next();
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res
            .status(500)
            .json({ error: error.message, message: "Failed to create products" });
    }
});
module.exports = {
    authUser,
    allProductsMiddlware,
    productsByUserIdMiddleware,
    productsCreationMiddleware,
};
