import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.config.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import { registerRoutes } from "./routes.js";

export const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
    credentials: env.CORS_ORIGIN !== "*"
  })
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

registerRoutes(app);

app.use(errorMiddleware);
