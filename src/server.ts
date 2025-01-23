import app from "./app";
import config from "./config/config";
import { Logger } from "./library/Logger";
import connectDB from "./config/database";
const port: number = config.PORT;

connectDB();

app.listen(port, () => {
  Logger.info(`App running on port: ${port}`);
});
