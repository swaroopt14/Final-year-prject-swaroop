import pinoHttp from "pino-http";
import { env } from "../config/env.config.js";

export const loggerMiddleware = pinoHttp({
  level: env.LOG_LEVEL,
  redact: {
    paths: ["req.headers.authorization"],
    remove: true
  }
});

