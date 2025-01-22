import User from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Logger } from "../library/Logger";

const createUser = async (req: Request, res: Response) => {
  const { name, username, email, password, isAdmin } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "username already exists" });
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ message: "email already exists" });
    }

    const salt: string = await bcrypt.genSalt(12);
    const hashPassword: string = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      username,
      email,
      password: hashPassword,
      isAdmin,
    });
    await user.save();

    return res.status(200).json({
      name: user.name,
      username: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    Logger.error("An error occured while registering user");
    return res.status(500).json({
      details: (error as Error).message,
      errMessage: "An error occured whle registering user",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    if (!email && !username) {
      return res.status(400).json({ message: "Email or username is required" });
    }
    const query = email ? { email } : { username };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      String(password),
      String(user.password)
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const secret = process.env.SECRET_KEY as string;
    const token: string = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "6h",
    });
    Logger.info("User logged in successfully", { userID: user._id });
    return res.status(200).json({ token: token });
  } catch (error) {
    Logger.error("An error occured while user was logging");
    return res.status(500).json({
      details: (error as Error).message,
      errMessage: "An error occured while logging in the user",
    });
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const user = await User.find();
    return res.status(200).json(user);
  } catch (error) {
    Logger.error((error as Error).message);
    return res.status(500).json({
      message: "An error occured while fetching a list of all users",
      details: (error as Error).message,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json("Invalid user Id");
    }

    res.status(200).json(user);
  } catch (error) {
    Logger.error((error as Error).message);
    res.status(500).json({
      details: (error as Error).message,
      errMessage: "An error occured whie fetching user with the given ID",
    });
  }
};

export { createUser, getAllUser, getUserById, loginUser };
