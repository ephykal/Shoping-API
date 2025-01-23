import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem extends Document {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

const orderItemSchema: Schema<IOrderItem> = new Schema<IOrderItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please insert product ID"],
    },
    quantity: { type: Number, required: [true, "please add quantity number"] },
  },
  { timestamps: true }
);

const orderItem: Model<IOrderItem> = mongoose.model<IOrderItem>(
  "OrderItem",
  orderItemSchema
);

export default orderItem;
