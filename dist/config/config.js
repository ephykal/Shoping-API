"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
dotenv_1.default.config();
const envSchema = joi_1.default.object({
    MONGO_URL: joi_1.default.string().uri().required(),
    MONGO_URL1: joi_1.default.string().uri().required(),
    PORT: joi_1.default.number().default(2000),
    API_URL: joi_1.default.string().required(),
    SECRET_KEY: joi_1.default.string().required(),
    NODE_ENV: joi_1.default.string()
        .valid("development", "production")
        .default("development"),
}).unknown();
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error:${error.message}`);
}
const config = {
    MONGO_URL: envVars.MONGO_URL,
    MONGO_URL1: envVars.MONGO_URL1,
    PORT: envVars.PORT,
    NODE_ENV: envVars.NODE_ENV,
    API_URL: envVars.API_URL,
    SECRET_KEY: envVars.SECRET_KEY,
};
exports.default = config;
