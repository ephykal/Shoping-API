import { Response } from "express";

declare module "express" {
  export interface Request {
    user?: any;
  }
}
