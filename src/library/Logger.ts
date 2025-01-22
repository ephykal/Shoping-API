// import chalk from "chalk";

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

import chalk from "chalk";

export class Logger {
  /**
   * Logs an informational message with optional arguments.
   */
  static info(message: string, ...args: any[]): void {
    console.log(
      chalk.blue(`[INFO] ${new Date().toLocaleString()}: ${message}`),
      ...args
    );
  }

  /**
   * Logs a warning message with optional arguments.
   */
  static warning(message: string, ...args: any[]): void {
    console.log(
      chalk.yellow(`[WARNING] ${new Date().toLocaleString()}: ${message}`),
      ...args
    );
  }

  /**
   * Logs an error message with optional arguments.
   */
  static error(message: string, ...args: any[]): void {
    console.log(
      chalk.red(`[ERROR] ${new Date().toLocaleString()}: ${message}`),
      ...args
    );
  }
}
