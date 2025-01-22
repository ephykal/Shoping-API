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
exports.loginUser = exports.getUserById = exports.getAllUser = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Logger_1 = require("../library/Logger");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, email, password, isAdmin } = req.body;
    try {
        const existingUser = yield userModel_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "username already exists" });
        }
        const existingUserEmail = yield userModel_1.default.findOne({ email });
        if (existingUserEmail) {
            return res.status(400).json({ message: "email already exists" });
        }
        const salt = yield bcrypt_1.default.genSalt(12);
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        const user = new userModel_1.default({
            name,
            username,
            email,
            password: hashPassword,
            isAdmin,
        });
        yield user.save();
        return res.status(200).json({
            name: user.name,
            username: user.name,
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
        });
    }
    catch (error) {
        Logger_1.Logger.error("An error occured while registering user");
        return res.status(500).json({
            details: error.message,
            errMessage: "An error occured whle registering user",
        });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    try {
        if (!email && !username) {
            return res.status(400).json({ message: "Email or username is required" });
        }
        const query = email ? { email } : { username };
        const user = yield userModel_1.default.findOne(query);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(String(password), String(user.password));
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const secret = process.env.SECRET_KEY;
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, secret, {
            expiresIn: "6h",
        });
        Logger_1.Logger.info("User logged in successfully", { userID: user._id });
        return res.status(200).json({ token: token });
    }
    catch (error) {
        Logger_1.Logger.error("An error occured while user was logging");
        return res.status(500).json({
            details: error.message,
            errMessage: "An error occured while logging in the user",
        });
    }
});
exports.loginUser = loginUser;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.find();
        return res.status(200).json(user);
    }
    catch (error) {
        Logger_1.Logger.error(error.message);
        return res.status(500).json({
            message: "An error occured while fetching a list of all users",
            details: error.message,
        });
    }
});
exports.getAllUser = getAllUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield userModel_1.default.findById(id);
        if (!user) {
            return res.status(401).json("Invalid user Id");
        }
        res.status(200).json(user);
    }
    catch (error) {
        Logger_1.Logger.error(error.message);
        res.status(500).json({
            details: error.message,
            errMessage: "An error occured whie fetching user with the given ID",
        });
    }
});
exports.getUserById = getUserById;
