// import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../model/userModel";
import Product, { IProduct } from "../model/productsModel";
import { Logger } from "../library/Logger";

// interface AuthenticatedRequest extends Request {
//   user?: IUser;
//   // user?:typeof User
// }

// const authUser = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).send({ message: "Unauthorized" });
//     }
//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return res.status(401).send({ message: "Unauthorized" });
//     }

//     try {
//       const decoded = jwt.verify(token, "my-jwt-secret");
//       const userId = (decoded as jwt.JwtPayload).userId;
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(401).send({ message: "Unauthorized ID" });
//       }

//       req.user = user;
//     } catch (error) {
//       console.log(error);
//       return res.status(401).json({ message: "Expired Token" });
//     }
//   } catch (error) {
//     console.log("Failed to authenticate", error);
//     res.status(500).json({ message: "Failed to authenticate" });
//   }
// };

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const productsList: IProduct[] = await Product.find();
    return res.status(200).json(productsList);
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      details: (error as Error).message,
      message: "Failed to fetch products",
    });
  }
};

const getProductByUserId = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  try {
    const productsByUserId = await Product.find({ user: userId });
    if (!productsByUserId || productsByUserId.length === 0) {
      return res
        .status(404)
        .json({ message: `No products found for user ${userId}` });
    }
    return res.status(200).json(productsByUserId);
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      details: (error as Error).message,
      message: `Can not fetch products posted by ${userId}`,
    });
  }
};

const getProductById = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `No products found for the provided ${id}` });
    }
    return res.status(200).json(product);
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      details: (error as Error).message,
      message: `Can not fetch products with this ${id}`,
    });
  }
};

const createProduct = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  const userId: string = req.body.user;
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(401).send({ message: "Unauthorized: Invalid user id" });
    }

    if (!existingUser.isAdmin) {
      return res.status(403).send("Forbidden:Only admins can create product");
    }

    const product = new Product({ name, description, price, user: userId });
    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      details: (error as Error).message,
      message: "Failed to create products",
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  const id: string = req.params.id;
  // const userId: string = req.body.user;
  try {
    // const existingUser = await User.findById(userId);
    // if (!existingUser) {
    //   Logger.error("Invalid user id");
    //   return res.status(404).json("invaild user Id");
    // }
    // if (!existingUser.isAdmin) {
    //   Logger.error("Only admins can update products");
    //   return res.status(403).send("Forbidden: Only admins can update products");
    // }

    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true }
    );

    if (!product) {
      Logger.error("Invalid product id");
      return res.status(404).json("Invalid product id");
    }

    return res.status(201).json(product);
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      details: (error as Error).message,
      message: "Failed to update product",
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      Logger.error("Product ID not found");
      return res.status(404).json("Product Id not found");
    }
    Logger.info("Product successfully deleted");
    return res.send("Successfully deleted");
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      details: (error as Error).message,
      message: "An error occured while delteing product with the given id",
    });
  }
};

const featuredProduct = async (req: Request, res: Response) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const product = await Product.find({ isFeatured: true }).limit(+count);

    return res.status(200).json(product);
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      message: "An error occured while fetching all featured products",
      details: (error as Error).message,
    });
  }
};

const productCount = async (req: Request, res: Response) => {
  try {
    const query = { product: Product };
    const count = await Product.countDocuments(query);

    return res.status(200).json(count);
  } catch (error) {
    Logger.error((error as Error).message, error);
    return res.status(500).json({
      message: "An error occured while fetching product count",
      details: (error as Error).message,
    });
  }
};

export {
  getAllProduct,
  getProductById,
  getProductByUserId,
  createProduct,
  deleteProduct,
  updateProduct,
  featuredProduct,
  productCount,
};
