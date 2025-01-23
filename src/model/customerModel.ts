import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email: string;
  age: number;
}

const customerSchema: Schema<ICustomer> = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, "please add a  name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add a valid email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    age: {
      type: Number,
      required: [true, "please add a  valid age"],
      min: [0, "Age must be a positibe number"],
    },
  },
  { timestamps: true }
);

const Customer: Model<ICustomer> = mongoose.model<ICustomer>(
  "Customer",
  customerSchema
);

export default Customer;
