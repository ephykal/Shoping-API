import { NextFunction, Request, Response } from "express";
import "../types/express"; // Import the extended Request interface
import jwt, { JwtPayload } from "jsonwebtoken";
import { Logger } from "../library/Logger";
import User, { IUser } from "../model/userModel";
const secret = process.env.SECRET_KEY as string;

const authUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const token = req.headers.authorization?.split(" ")[1];
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(400).json("Unauthorized:No token provided");
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      const userId = decoded.userId;
      const user: IUser | null = await User.findById(userId);

      if (!user) {
        res.status(400).json("Unauthorized Id");
      }

      req.user = user;

      if (user.isAdmin) {
        next();
      } else {
        res.status(401).json(" Admin access is required");
      }
    } catch (error) {
      Logger.error("Token verification failed", error);
      res.status(401).json({
        errMessage: "Invalid or Expired Token",
        err: (error as Error).message,
      });
    }
  } catch (error) {
    Logger.error("Failed to authenticate user", error);
    res
      .status(500)
      .json({ err: error as Error, errMessage: "Failed to autheitcate" });
  }
};

export default authUser;
