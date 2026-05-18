import type { Request } from "express";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.config.js";
import { HttpError } from "../utils/httpError.js";

export type AuthUser = {
  sub: string;
  role: "doctor" | "nurse" | "admin";
  name?: string;
  email?: string;
  department?: string;
};

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

export function extractToken(req: Request): string | undefined {
  const header = typeof req.header === "function" ? req.header("authorization") : undefined;
  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }

  const cookieToken = req.cookies?.sc_token;
  if (typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }

  return undefined;
}

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const token = extractToken(req);
  if (!token) {
    return next(new HttpError(401, "Authentication required", "AUTH_REQUIRED"));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = decoded;
    return next();
  } catch {
    return next(new HttpError(401, "Invalid token", "AUTH_INVALID"));
  }
};
