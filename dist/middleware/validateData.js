"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserInput = exports.validateProductInput = exports.validateOrderInput = exports.validateCustomerInput = exports.validateCategoryInput = void 0;
const joi_1 = __importDefault(require("joi"));
const Logger_1 = require("../library/Logger");
const orderValidationSchema = joi_1.default.object({
    shippingAddress1: joi_1.default.string().required(),
    shippingAddress2: joi_1.default.string().optional(),
    status: joi_1.default.string()
        .valid("pending", "shipped", "delivered", "canceled")
        .required(),
    city: joi_1.default.string().required(),
    zip: joi_1.default.string()
        .pattern(/^[a-zA-Z0-9\s\-]{3,10}$/)
        .optional()
        .messages({ "string.pattern.base": "Please provide a valid zip code" }),
    country: joi_1.default.string().required(),
    phoneNo: joi_1.default.string()
        .pattern(/^\+?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/)
        .required()
        .messages({
        "string.pattern.base": "Phone number must be a valid international format, e.g., +1-123-456-7890",
    }),
    user: joi_1.default.string().required(),
    dateOrdered: joi_1.default.date().optional(),
    orderItems: joi_1.default.array()
        .items(joi_1.default.object({
        quantity: joi_1.default.number().min(1).required(),
        product: joi_1.default.string().required(),
    }))
        .min(1)
        .required(),
});
const categoryValidationSchema = joi_1.default.object({
    name: joi_1.default.string().max(50).trim().required(),
    icon: joi_1.default.string().optional(),
    color: joi_1.default.string().optional(),
});
const customerValidateSchema = joi_1.default.object({
    name: joi_1.default.string().max(50).trim().required(),
    email: joi_1.default.string()
        .trim()
        .required()
        .pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        .messages({ "string.pattern.base": "Please enter a valid email" }),
    age: joi_1.default.number().min(1).required(),
});
const userValidationSchema = joi_1.default.object({
    name: joi_1.default.string().max(50).required(),
    email: joi_1.default.string()
        .trim()
        .required()
        .pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        .messages({ "string.patter.base": "Please enter a valid email" }),
    username: joi_1.default.string().min(3).max(30).trim().required(),
    password: joi_1.default.string().min(6).max(1024).trim().required(),
    isAdmin: joi_1.default.boolean().required(),
});
const productValidationSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(50).required(),
    description: joi_1.default.string().required().max(500).trim(),
    price: joi_1.default.number().required().min(1),
    user: joi_1.default.string().required(),
    isFeatured: joi_1.default.boolean().optional(),
});
const validateOrderInput = (req, res, next) => {
    const { error } = orderValidationSchema.validate(req.body);
    if (error) {
        Logger_1.Logger.error("Validation error", error.message);
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map((detail) => detail.message).join(", "),
        });
    }
    next();
};
exports.validateOrderInput = validateOrderInput;
const validateCategoryInput = (req, res, next) => {
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) {
        Logger_1.Logger.error("Validation error", error.message);
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map((detail) => detail.message).join(", "),
        });
    }
    next();
};
exports.validateCategoryInput = validateCategoryInput;
const validateCustomerInput = (req, res, next) => {
    const { error } = customerValidateSchema.validate(req.body);
    if (error) {
        Logger_1.Logger.error("Validation error", error.message);
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map((detail) => detail.message).join(", "),
        });
    }
    next();
};
exports.validateCustomerInput = validateCustomerInput;
const validateUserInput = (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
        Logger_1.Logger.error("Validation error", error.message);
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map((detail) => detail.message).join(", "),
        });
    }
    next();
};
exports.validateUserInput = validateUserInput;
const validateProductInput = (req, res, next) => {
    const { error } = productValidationSchema.validate(req.body);
    if (error) {
        Logger_1.Logger.error("Validation error", error.message);
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map((detail) => detail.message).join(", "),
        });
    }
    next();
};
exports.validateProductInput = validateProductInput;
