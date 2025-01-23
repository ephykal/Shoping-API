"use strict";
// import chalk from "chalk";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
// export class Logger {
//   static log(args: any, message?: string) {
//     Logger.info(args, message);
//   }
//   static info(args: any, message?: string) {
//     console.log(
//       chalk.blue(`[${new Date().toLocaleString()}],[INFO]`),
//       typeof args === "string" ? chalk.blueBright(args) : args,
//       typeof message === "string" ? chalk.blueBright(message) : message
//     );
//   }
//   static warining(args: any, message?: string) {
//     console.log(
//       chalk.yellow(`[${new Date().toLocaleString()}],[WARNING]`),
//       typeof args === "string" ? chalk.yellowBright(args) : args,
//       typeof message === "string" ? chalk.blueBright(message) : message
//     );
//   }
//   static error(args: any, message?: string) {
//     console.log(
//       chalk.red(`[${new Date().toLocaleString()}],[ERROR]`),
//       typeof args === "string" ? chalk.redBright(args) : args,
//       typeof message === "string" ? chalk.redBright(message) : message
//     );
//   }
// }
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    /**
     * Logs an informational message with optional arguments.
     */
    static info(message, ...args) {
        console.log(chalk_1.default.blue(`[INFO] ${new Date().toLocaleString()}: ${message}`), ...args);
    }
    /**
     * Logs a warning message with optional arguments.
     */
    static warning(message, ...args) {
        console.log(chalk_1.default.yellow(`[WARNING] ${new Date().toLocaleString()}: ${message}`), ...args);
    }
    /**
     * Logs an error message with optional arguments.
     */
    static error(message, ...args) {
        console.log(chalk_1.default.red(`[ERROR] ${new Date().toLocaleString()}: ${message}`), ...args);
    }
}
exports.Logger = Logger;
