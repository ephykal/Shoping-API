import express, { Request, Response } from "express";
import helmet from "helmet";
import config from "./config/config";

import productRouter from "./routes/productsRouter";
import customerRouter from "./routes/customerRouter";
import orderRouter from "./routes/orderRouter";
import categoryRouter from "./routes/categoryRouter";
import userRouter from "./routes/userRouter";
const api = config.API_URL;

const app = express();

app.use(express.json());
app.use(helmet());

app.use(`${api}/products`, productRouter);
app.use(`${api}/customers`, customerRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/users`, userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to our shopping-api platform");
});

export default app;
