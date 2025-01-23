"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please enter your name"],
        maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
    },
    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: true,
        trim: true,
        minlength: [3, "username must be at lease 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"],
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters"],
        required: [true, "please enter a strong password combination"],
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: [true, "please specify if user is an admin or not"],
    },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
