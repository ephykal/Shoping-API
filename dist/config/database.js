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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const Logger_1 = require("../library/Logger");
const url = config_1.default.MONGO_URL;
// const url1: string = config.MONGO_URL1;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(url, { dbName: "shopping-api" });
        Logger_1.Logger.info("Connected to DB");
    }
    catch (error) {
        if (error instanceof Error) {
            Logger_1.Logger.error("Cannot connect to DB, please check your internet connection and try again", error.message);
        }
        else {
            Logger_1.Logger.error("An unknown error occured while connection to the DB");
        }
        process.exit(1);
    }
});
exports.default = connectDB;
