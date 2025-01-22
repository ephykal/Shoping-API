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
exports.loginUserMiddleware = exports.registerUserMiddleware = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Logger_1 = require("../library/Logger");
const registerUserMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, name, email, password } = req.body;
    try {
        const existingUser = yield userModel_1.default.findOne({ username });
        const existingUserEmail = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "username already exists" });
        }
        if (existingUserEmail) {
            return res.status(400).json({ message: "email already" });
        }
        const newUser = new userModel_1.default({ username, email, name, password });
        yield newUser.save();
        const userId = newUser._id;
        Logger_1.Logger.info("user:", newUser);
        res.locals.userId = userId;
        next();
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res
            .status(400)
            .json({
            error: error.message,
            message: "An error occured while registering the user",
        });
    }
});
exports.registerUserMiddleware = registerUserMiddleware;
const loginUserMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "invalid username" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(String(password), String(user.password));
        if (!isPasswordValid) {
            return res.staus(400).json({ message: "invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, "my-jwt-secret", {
            expiresIn: "1h",
        });
        res.locals.token = token;
        next();
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res
            .status(500)
            .json({
            error: error.message,
            message: "An error occured while authenticating the user",
        });
    }
});
exports.loginUserMiddleware = loginUserMiddleware;
