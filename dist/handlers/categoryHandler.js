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
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryLists = yield categoryModel_1.default.find();
        return res.status(200).json(categoryLists);
    }
    catch (error) {
        Logger_1.Logger.error(error.message);
        return res.status(500).json({ details: error.message });
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
        Logger_1.Logger.error(error.message);
        return res.status(500).json({
            message: "An error occured while fetching the category with the given ID",
            details: error.message,
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
        if (!name && !color) {
            Logger_1.Logger.error("Name and color are required");
            return res.status(404).json("Name and color are required f");
        }
        const createdCategory = yield category.save();
        return res.status(201).json(createdCategory);
    }
    catch (error) {
        Logger_1.Logger.error(error.message);
        return res.status(500).json({
            details: error.message,
            message: "category can not be created",
        });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, color, icon } = req.body;
    try {
        const category = yield categoryModel_1.default.findByIdAndUpdate(id, { name, icon, color }, { new: true });
        if (!category) {
            return res.status(400).json("Category not found");
        }
        if ((!name && !color) || !icon) {
            Logger_1.Logger.error("name, color and icon are required");
            return res.status(400).send("name, color and icon are required");
        }
        Logger_1.Logger.info("Category successfully updated");
        return res.status(200).json(category);
    }
    catch (error) {
        Logger_1.Logger.error(error.message);
        return res.status(500).json({
            errMessage: "An error occured while updating category with the given ID",
            details: error.message,
        });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const category = yield categoryModel_1.default.findByIdAndDelete(id);
        if (!category) {
            return res.status(400).json(" Category with the given Id not found");
        }
        Logger_1.Logger.info("Category successfully deleted");
        return res.json("Succefully deleted");
    }
    catch (error) {
        Logger_1.Logger.error("Delection error", error.message);
        return res.status(500).json({
            details: error.message,
            errMessage: "An error occured while deleting category with the given ID",
        });
    }
});
exports.deleteCategory = deleteCategory;
