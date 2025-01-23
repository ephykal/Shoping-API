import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { Logger } from "../library/Logger";

const orderValidationSchema = Joi.object({
  shippingAddress1: Joi.string().required(),
  shippingAddress2: Joi.string().optional(),
  status: Joi.string()
    .valid("pending", "shipped", "delivered", "canceled")
    .required(),
  city: Joi.string().required(),
  zip: Joi.string()
    .pattern(/^[a-zA-Z0-9\s\-]{3,10}$/)
    .optional()
    .messages({ "string.pattern.base": "Please provide a valid zip code" }),
  country: Joi.string().required(),
  phoneNo: Joi.string()
    .pattern(
      /^\+?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid international format, e.g., +1-123-456-7890",
    }),
  user: Joi.string().required(),
  dateOrdered: Joi.date().optional(),
  orderItems: Joi.array()
    .items(
      Joi.object({
        quantity: Joi.number().min(1).required(),
        product: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
});

const categoryValidationSchema = Joi.object({
  name: Joi.string().max(50).trim().required(),
  icon: Joi.string().optional(),
  color: Joi.string().optional(),
});

const customerValidateSchema = Joi.object({
  name: Joi.string().max(50).trim().required(),
  email: Joi.string()
    .trim()
    .required()
    .pattern(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .messages({ "string.pattern.base": "Please enter a valid email" }),
  age: Joi.number().min(1).required(),
});

const userValidationSchema = Joi.object({
  name: Joi.string().max(50).required(),
  email: Joi.string()
    .trim()
    .required()
    .pattern(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .messages({ "string.patter.base": "Please enter a valid email" }),
  username: Joi.string().min(3).max(30).trim().required(),
  password: Joi.string().min(6).max(1024).trim().required(),
  isAdmin: Joi.boolean().required(),
});

const productValidationSchema = Joi.object({
  name: Joi.string().trim().max(50).required(),
  description: Joi.string().required().max(500).trim(),
  price: Joi.number().required().min(1),
  user: Joi.string().required(),
  isFeatured: Joi.boolean().optional(),
});

const validateOrderInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = orderValidationSchema.validate(req.body);
  if (error) {
    Logger.error("Validation error", (error as Error).message);
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message).join(", "),
    });
  }
  next();
};

const validateCategoryInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = categoryValidationSchema.validate(req.body);
  if (error) {
    Logger.error("Validation error", (error as Error).message);
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message).join(", "),
    });
  }
  next();
};

const validateCustomerInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = customerValidateSchema.validate(req.body);
  if (error) {
    Logger.error("Validation error", (error as Error).message);
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message).join(", "),
    });
  }
  next();
};

const validateUserInput = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    Logger.error("Validation error", (error as Error).message);
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message).join(", "),
    });
  }
  next();
};

const validateProductInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = productValidationSchema.validate(req.body);
  if (error) {
    Logger.error("Validation error", (error as Error).message);
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message).join(", "),
    });
  }
  next();
};

export {
  validateCategoryInput,
  validateCustomerInput,
  validateOrderInput,
  validateProductInput,
  validateUserInput,
};
