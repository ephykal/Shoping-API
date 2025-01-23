"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userHandler_1 = require("../handlers/userHandler");
const validateObjectId_1 = __importDefault(require("../middleware/validateObjectId"));
const validateData_1 = require("../middleware/validateData");
const router = express_1.default.Router();
router.get("/", userHandler_1.getAllUser);
router.get("/:id", validateObjectId_1.default, userHandler_1.getUserById);
router.post("/register", validateData_1.validateUserInput, userHandler_1.createUser);
router.post("/login", userHandler_1.loginUser);
exports.default = router;
