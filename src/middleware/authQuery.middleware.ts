import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.config.js";
import { HttpError } from "../utils/httpError.js";
import type { AuthUser } from "./auth.middleware.js";

export const authQueryMiddleware: RequestHandler = (req, _res, next) => {
  const token = typeof req.query.token === "string" ? req.query.token : undefined;
  if (!token) return next(new HttpError(401, "Missing token query param", "AUTH_REQUIRED"));

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = decoded;
    return next();
  } catch {
    return next(new HttpError(401, "Invalid token", "AUTH_INVALID"));
  }
};

