import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  orderItems: mongoose.Schema.Types.ObjectId[];
  shippingAddress1: string;
  shippingAddress2?: string;
  status?: string;
  city: string;
  zip?: string;
  country: string;
  phoneNo: string;
  totalPrice: number;
  user: mongoose.Schema.Types.ObjectId;
  dateOrdered?: Date;
}

const orderSchema: Schema<IOrder> = new Schema<IOrder>(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    shippingAddress1: {
      type: String,
      required: [true, "Please add your shipping address"],
      trim: true,
    },
    shippingAddress2: { type: String, trim: true, required: false },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "shipped", "delivered", "canceled"],
    },
    city: { type: String, required: [true, "please add your city"] },
    zip: {
      type: String,
      required: false,
      match: [/^[a-zA-Z0-9\s\-]{3,10}$/, "Please provide a valid zip code"],
    },
    country: {
      type: String,
      trim: true,
      required: [true, "please your country of shipment"],
    },
    phoneNo: {
      type: String,
      required: [true, "Please provide your phone number"],
      validate: {
        validator: (v: string) =>
          /^\+?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/.test(
            v
          ),
        message:
          "Phone number must be a valid international format, e.g., +1-123-456-7890",
      },
    },
    totalPrice: {
      type: Number,
      required: false,
      min: [0, "Total price must be a positive number"],
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateOrdered: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.model<IOrder>("order", orderSchema);

export default Order;
