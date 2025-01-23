"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateObjectId_1 = __importDefault(require("../middleware/validateObjectId"));
const auth_1 = __importDefault(require("../middleware/auth"));
const customerHandler_1 = require("../handlers/customerHandler");
const validateData_1 = require("../middleware/validateData");
const router = express_1.default.Router();
router.get("/", customerHandler_1.getAllCustomer);
router.get("/:id", validateObjectId_1.default, customerHandler_1.getAllCustomerById);
router.post("/create-customer", validateData_1.validateCustomerInput, customerHandler_1.createCustomer);
router.put("/update-customer/:id", validateObjectId_1.default, auth_1.default, customerHandler_1.updateCustomer);
router.delete("/delete-customer/:id", validateObjectId_1.default, auth_1.default, customerHandler_1.deleteCustomer);
exports.default = router;
