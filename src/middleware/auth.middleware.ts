import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.config.js";
import { HttpError } from "../utils/httpError.js";

export type AuthUser = {
  sub: string;
  role: "doctor" | "nurse" | "admin";
};

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing or invalid Authorization header", "AUTH_REQUIRED"));
  }

  const token = header.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = decoded;
    return next();
  } catch {
    return next(new HttpError(401, "Invalid token", "AUTH_INVALID"));
  }
};

