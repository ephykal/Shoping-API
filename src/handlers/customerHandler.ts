import Customer from "../model/customerModel";
import { Request, Response } from "express";
import { Logger } from "../library/Logger";

const getAllCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.find();
    Logger.info("Customers successfully fetched");
    return res.status(200).json(customer);
  } catch (error) {
    Logger.error((error as Error).message);
    return res.status(500).json({
      details: (error as Error).message,
      errMessage: "An error occured while fetching a list of all cusomers",
    });
  }
};

const getAllCustomerById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(400).json("Customer not found");
    }
    Logger.info("Customer with the given ID successfully fetched");
    return res.status(200).json(customer);
  } catch (error) {
    Logger.error((error as Error).message);
    return res.status(500).json({
      details: (error as Error).message,
      errMessage: "An error occured while fetching customers with the given ID",
    });
  }
};

const createCustomer = async (req: Request, res: Response) => {
  const { name, email, age } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(400).json({ message: "email already exists" });
    }

    const customer = new Customer({
      name,
      email,
      age,
    });

    if (!name && !email && !age) {
      Logger.error("name, email and age are required");
      return res.status(400).json("name, email and age are required");
    }

    const createdCustomer = await customer.save();
    Logger.info("Customer successfully created");
    res.status(200).json(createdCustomer);
  } catch (error) {
    Logger.error((error as Error).message);
    return res.status(500).json({
      details: (error as Error).message,
      message:
        "customer can not be created, an error occured while creating customer",
    });
  }
};

const updateCustomer = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    const { name, age } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      id,
      { name, age },
      { new: true }
    );

    if (!customer) {
      return res.status(400).json("Customer not found");
    }

    if (!name && !age) {
      Logger.error("name or age are required");
      return res.status(400).send("name or age are required");
    }

    Logger.info("Customer with the given ID successfully updated");
    return res
      .status(500)
      .json({ message: "customer successfully updated", customer });
  } catch (error) {
    Logger.error((error as Error).message);
    return res.status(500).json({
      details: (error as Error).message,
      errMessage: "An error occured while updating customer with the given ID",
    });
  }
};

const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(400).json("Customer not found");
    }
    Logger.info("Customer with the given ID successfully deleted");
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    Logger.error((error as Error).message);
    return res.status(500).json({
      details: (error as Error).message,
      errMessage: "An error occured while deleting customer with the given ID",
    });
  }
};

export {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomer,
  getAllCustomerById,
};
