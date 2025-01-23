import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  icon?: string;
  color: string;
}

const categorySchema: Schema<ICategory> = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "please add a name"],
      trim: true,
    },
    icon: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: [true, "please add a color"],
    },
  },
  { timestamps: true }
);

const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  categorySchema
);

export default Category;
