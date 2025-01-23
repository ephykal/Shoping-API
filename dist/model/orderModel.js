"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    orderItems: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "OrderItem",
            required: true,
        },
    ],
    shippingAddress1: {
        type: String,
        required: [true, "Please add your shipping address"],
        trim: true,
    },
    shippingAddress2: { type: String, trim: true, required: false },
    status: {
        type: String,
        required: true,
        default: "pending",
        enum: ["pending", "shipped", "delivered", "canceled"],
    },
    city: { type: String, required: [true, "please add your city"] },
    zip: {
        type: String,
        required: false,
        match: [/^[a-zA-Z0-9\s\-]{3,10}$/, "Please provide a valid zip code"],
    },
    country: {
        type: String,
        trim: true,
        required: [true, "please your country of shipment"],
    },
    phoneNo: {
        type: String,
        required: [true, "Please provide your phone number"],
        validate: {
            validator: (v) => /^\+?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/.test(v),
            message: "Phone number must be a valid international format, e.g., +1-123-456-7890",
        },
    },
    totalPrice: {
        type: Number,
        required: false,
        min: [0, "Total price must be a positive number"],
    },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    dateOrdered: { type: Date, default: Date.now },
}, { timestamps: true });
const Order = mongoose_1.default.model("order", orderSchema);
exports.default = Order;
