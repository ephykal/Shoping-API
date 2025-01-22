import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please enter your name"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    username: {
      type: String,
      required: [true, "Please enter a username"],
      unique: true,
      trim: true,
      minlength: [3, "username must be at lease 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      required: [true, "please enter a strong password combination"],
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: [true, "please specify if user is an admin or not"],
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>("user", userSchema);

export default User;
