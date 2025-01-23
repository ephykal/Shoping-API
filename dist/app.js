"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = __importDefault(require("./config/config"));
const productsRouter_1 = __importDefault(require("./routes/productsRouter"));
const customerRouter_1 = __importDefault(require("./routes/customerRouter"));
const orderRouter_1 = __importDefault(require("./routes/orderRouter"));
const categoryRouter_1 = __importDefault(require("./routes/categoryRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const api = config_1.default.API_URL;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(`${api}/products`, productsRouter_1.default);
app.use(`${api}/customers`, customerRouter_1.default);
app.use(`${api}/orders`, orderRouter_1.default);
app.use(`${api}/category`, categoryRouter_1.default);
app.use(`${api}/users`, userRouter_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to our shopping-api platform");
});
exports.default = app;
