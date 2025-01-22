"use strict";
// import mongoose from "mongoose";
// import { Request, Response, NextFunction } from "express";
// import { Logger } from "../library/Logger";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id, customerId, userId } = req.params;
//     if (id && !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).send("Invalid ID");
//     }
//     if (customerId && !mongoose.Types.ObjectId.isValid(customerId)) {
//       return res.status(400).send("Invalid customer Id");
//     }
//     if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).send("Invalid user Id");
//     }
//     next();
//   } catch (error) {
//     Logger.error((error as Error).message, error);
//     res
//       .status(500)
//       .json({
//         errMessage: (error as Error).message,
//         message: "An error occured, id not found",
//       });
//     next(error);
//   }
// };
// export default validateObjectId;
const mongoose_1 = __importDefault(require("mongoose"));
const validateObjectId = (req, res, next) => {
    try {
        const { id, customerId, userId } = req.params;
        if (id && !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID");
        }
        if (customerId && !mongoose_1.default.Types.ObjectId.isValid(customerId)) {
            return res.status(400).send("Invalid customer ID");
        }
        if (userId && !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).send("Invalid user ID");
        }
        next();
    }
    catch (error) {
        next(error); // Pass error to the default error handler
    }
};
exports.default = validateObjectId;
