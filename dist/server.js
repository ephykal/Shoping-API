"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const Logger_1 = require("./library/Logger");
const database_1 = __importDefault(require("./config/database"));
const port = config_1.default.PORT;
(0, database_1.default)();
app_1.default.listen(port, () => {
    Logger_1.Logger.info(`App running on port: ${port}`);
});
