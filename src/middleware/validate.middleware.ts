import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { HttpError } from "../utils/httpError.js";

export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new HttpError(400, "Validation error", "VALIDATION_ERROR", parsed.error.flatten()));
    }
    req.body = parsed.data as unknown;
    return next();
  };
}

