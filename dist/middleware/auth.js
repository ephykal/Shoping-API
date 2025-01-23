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
require("../types/express"); // Import the extended Request interface
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Logger_1 = require("../library/Logger");
const userModel_1 = __importDefault(require("../model/userModel"));
const secret = process.env.SECRET_KEY;
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const token = req.headers.authorization?.split(" ")[1];
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(400).json("Unauthorized:No token provided");
            return;
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const userId = decoded.userId;
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                res.status(400).json("Unauthorized Id");
            }
            req.user = user;
            if (user.isAdmin) {
                next();
            }
            else {
                res.status(401).json(" Admin access is required");
            }
        }
        catch (error) {
            Logger_1.Logger.error("Token verification failed", error);
            res.status(401).json({
                errMessage: "Invalid or Expired Token",
                err: error.message,
            });
        }
    }
    catch (error) {
        Logger_1.Logger.error("Failed to authenticate user", error);
        res
            .status(500)
            .json({ err: error, errMessage: "Failed to autheitcate" });
    }
});
exports.default = authUser;
