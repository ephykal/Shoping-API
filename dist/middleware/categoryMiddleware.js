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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategory = void 0;
const categoryModel_1 = __importDefault(require("../model/categoryModel"));
const Logger_1 = require("../library/Logger");
const userModel_1 = __importDefault(require("../model/userModel"));
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryLists = yield categoryModel_1.default.find();
        return res.status(200).json(categoryLists);
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res.status(500).json({ err: error.message });
    }
});
exports.getAllCategory = getAllCategory;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const category = yield categoryModel_1.default.findById(id);
        if (!category) {
            return res
                .status(404)
                .json({ message: "Category with the given ID not found" });
        }
        return res.status(200).json(category);
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res.status(500).json({
            message: "An error occured while fetching the category with the given ID",
            err: error.message,
        });
    }
});
exports.getCategoryById = getCategoryById;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, icon, color } = req.body;
    try {
        const category = new categoryModel_1.default({
            name,
            icon,
            color,
        });
        const createdCategory = yield category.save();
        return res.status(201).json(createdCategory);
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res.status(500).json({
            err: error.message,
            message: "category can not be created",
        });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, color, image } = req.body;
    try {
        const category = yield categoryModel_1.default.findByIdAndUpdate(id, { name, image, color }, { new: true });
        if (!category) {
            return res.status(400).json("Invalid category id");
        }
        Logger_1.Logger.info("Category successfully updated");
        return res.status(200).json(category);
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res.status(500).json({
            errMessage: "An error occured while updating category with the given ID",
            err: error.message,
        });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield userModel_1.default.findByIdAndDelete(id);
        if (!user) {
            return res.status(400).json("Invalid category with the given Id");
        }
        Logger_1.Logger.info("Category successfully deleted");
        return res.json("Succefully deleted");
    }
    catch (error) {
        Logger_1.Logger.error(error, error.message);
        return res.status(500).json({
            err: error.message,
            errMessage: "An error occured while deleting category with the given ID",
        });
    }
});
exports.deleteCategory = deleteCategory;
