"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryHandler_1 = require("../handlers/categoryHandler");
const validateObjectId_1 = __importDefault(require("../middleware/validateObjectId"));
const auth_1 = __importDefault(require("../middleware/auth"));
const validateData_1 = require("../middleware/validateData");
const router = express_1.default.Router();
router.get("/", categoryHandler_1.getAllCategory);
router.get("/:id", validateObjectId_1.default, categoryHandler_1.getCategoryById);
router.post("/create-category", validateData_1.validateCategoryInput, categoryHandler_1.createCategory);
router.put("/update-category/:id", validateObjectId_1.default, auth_1.default, categoryHandler_1.updateCategory);
router.delete("/delete-category/:id", validateObjectId_1.default, auth_1.default, categoryHandler_1.deleteCategory);
exports.default = router;
