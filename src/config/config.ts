import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

interface EnvVars {
  MONGO_URL: string;
  MONGO_URL1: stirng;
  PORT: number;
  API_URL: string;
  SECRET_KEY: string;
  NODE_ENV: "development" | "production";
}

const envSchema = Joi.object({
  MONGO_URL: Joi.string().uri().required(),
  MONGO_URL1: Joi.string().uri().required(),
  PORT: Joi.number().default(2000),
  API_URL: Joi.string().required(),
  SECRET_KEY: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid("development", "production")
    .default("development"),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error:${error.message}`);
}

const config: EnvVars = {
  MONGO_URL: envVars.MONGO_URL,
  MONGO_URL1: envVars.MONGO_URL1,
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,
  API_URL: envVars.API_URL,
  SECRET_KEY: envVars.SECRET_KEY,
};

export default config;
