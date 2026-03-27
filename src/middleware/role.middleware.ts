import type { RequestHandler } from "express";
import { HttpError } from "../utils/httpError.js";
import type { AuthUser } from "./auth.middleware.js";

export function requireRole(roles: AuthUser["role"][]): RequestHandler {
  return (req, _res, next) => {
    const role = req.user?.role;
    if (!role) return next(new HttpError(401, "Authentication required", "AUTH_REQUIRED"));
    if (!roles.includes(role)) return next(new HttpError(403, "Forbidden", "FORBIDDEN"));
    return next();
  };
}

