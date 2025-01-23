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
exports.getAllCustomerById = exports.getAllCustomer = exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = void 0;
const customerModel_1 = __importDefault(require("../model/customerModel"));
const Logger_1 = require("../library/Logger");
const getAllCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customerModel_1.default.find();
        Logger_1.Logger.info("Customers successfully fetched");
        return res.status(200).json(customer);
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res.status(500).json({
            err: error.message,
            errMessage: "An error occured while fetching a list of all cusomers",
        });
    }
});
exports.getAllCustomer = getAllCustomer;
const getAllCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const customer = yield customerModel_1.default.findById(id);
        if (!customer) {
            return res.status(400).json("Invalid customer ID");
        }
        Logger_1.Logger.info("Customer with the given ID successfully fetched");
        return res.status(200).json(customer);
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res.status(500).json({
            err: error.message,
            errMessage: "An error occured while fetching customers with the given ID",
        });
    }
});
exports.getAllCustomerById = getAllCustomerById;
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, age } = req.body;
    try {
        const existingCustomer = yield customerModel_1.default.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "email already exists" });
        }
        const customer = new customerModel_1.default({
            name,
            email,
            age,
        });
        const createdCustomer = yield customer.save();
        Logger_1.Logger.info("Customer successfully created");
        res.status(200).json(createdCustomer);
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res.status(500).json({
            error: error.message,
            message: "customer can not be created",
            errMessage: "An error occured while creating customer",
        });
    }
});
exports.createCustomer = createCustomer;
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const { name, age } = req.body;
        const customer = yield customerModel_1.default.findByIdAndUpdate(id, { name, age }, { new: true });
        if (!customer) {
            return res.status(400).json("Invalid customer ID");
        }
        Logger_1.Logger.info("Customer with the given ID successfully updated");
        return res
            .status(500)
            .json({ message: "customer successfully updated", customer });
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res.status(500).json({
            err: error.message,
            errMessage: "An error occured while updating customer with the given ID",
        });
    }
});
exports.updateCustomer = updateCustomer;
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const customer = yield customerModel_1.default.findByIdAndDelete(id);
        if (!customer) {
            return res.status(400).json("Invalid customer ID");
        }
        Logger_1.Logger.info("Customer with the given ID successfully deleted");
        return res.status(209).json({ message: "Deleted" });
    }
    catch (error) {
        Logger_1.Logger.error(error);
        return res.status(500).json({
            err: error.message,
            errMessage: "An error occured while deleting customer with the given ID",
        });
    }
});
exports.deleteCustomer = deleteCustomer;
