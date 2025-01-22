import mongoose from "mongoose";
import config from "./config";
import { Logger } from "../library/Logger";
const url: string = config.MONGO_URL;
// const url1: string = config.MONGO_URL1;

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(url, { dbName: "shopping-api" });
    Logger.info("Connected to DB");
  } catch (error) {
    if (error instanceof Error) {
      Logger.error(
        "Cannot connect to DB, please check your internet connection and try again",
        error.message
      );
    } else {
      Logger.error("An unknown error occured while connection to the DB");
    }
    process.exit(1);
  }
};

export default connectDB;
