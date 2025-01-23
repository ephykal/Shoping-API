"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productCount = exports.featuredProduct = exports.updateProduct = exports.deleteProduct = exports.createProduct = exports.getProductByUserId = exports.getProductById = exports.getAllProduct = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const productsModel_1 = __importDefault(require("../model/productsModel"));
const Logger_1 = require("../library/Logger");
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
const getAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsList = yield productsModel_1.default.find();
        return res.status(200).json(productsList);
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            details: error.message,
            message: "Failed to fetch products",
        });
    }
});
exports.getAllProduct = getAllProduct;
const getProductByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const productsByUserId = yield productsModel_1.default.find({ user: userId });
        if (!productsByUserId || productsByUserId.length === 0) {
            return res
                .status(404)
                .json({ message: `No products found for user ${userId}` });
        }
        return res.status(200).json(productsByUserId);
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            details: error.message,
            message: `Can not fetch products posted by ${userId}`,
        });
    }
});
exports.getProductByUserId = getProductByUserId;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const product = yield productsModel_1.default.findById(id);
        if (!product) {
            return res
                .status(404)
                .json({ message: `No products found for the provided ${id}` });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            details: error.message,
            message: `Can not fetch products with this ${id}`,
        });
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price } = req.body;
    const userId = req.body.user;
    try {
        const existingUser = yield userModel_1.default.findById(userId);
        if (!existingUser) {
            return res.status(401).send({ message: "Unauthorized: Invalid user id" });
        }
        if (!existingUser.isAdmin) {
            return res.status(403).send("Forbidden:Only admins can create product");
        }
        const product = new productsModel_1.default({ name, description, price, user: userId });
        yield product.save();
        return res.status(201).json(product);
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            details: error.message,
            message: "Failed to create products",
        });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price } = req.body;
    const id = req.params.id;
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
        const product = yield productsModel_1.default.findByIdAndUpdate(id, { name, description, price }, { new: true });
        if (!product) {
            Logger_1.Logger.error("Invalid product id");
            return res.status(404).json("Invalid product id");
        }
        return res.status(201).json(product);
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            details: error.message,
            message: "Failed to update product",
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const product = yield productsModel_1.default.findByIdAndDelete(id);
        if (!product) {
            Logger_1.Logger.error("Product ID not found");
            return res.status(404).json("Product Id not found");
        }
        Logger_1.Logger.info("Product successfully deleted");
        return res.send("Successfully deleted");
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            details: error.message,
            message: "An error occured while delteing product with the given id",
        });
    }
});
exports.deleteProduct = deleteProduct;
const featuredProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = req.params.count ? req.params.count : 0;
        const product = yield productsModel_1.default.find({ isFeatured: true }).limit(+count);
        return res.status(200).json(product);
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            message: "An error occured while fetching all featured products",
            details: error.message,
        });
    }
});
exports.featuredProduct = featuredProduct;
const productCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = { product: productsModel_1.default };
        const count = yield productsModel_1.default.countDocuments(query);
        return res.status(200).json(count);
    }
    catch (error) {
        Logger_1.Logger.error(error.message, error);
        return res.status(500).json({
            message: "An error occured while fetching product count",
            details: error.message,
        });
    }
});
exports.productCount = productCount;
