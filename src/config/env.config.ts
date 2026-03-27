import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(20).default("replace_me_in_production_change_this"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  CORS_ORIGIN: z.string().default("*"),
  ML_SERVICE_BASE_URL: z.string().default("http://127.0.0.1:5000"),
  BERT_INFERENCE_URL: z.string().default("http://127.0.0.1:8001/infer"),
  AGENT_SERVICE_BASE_URL: z.string().default("http://127.0.0.1:7000"),
  GEMINI_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
