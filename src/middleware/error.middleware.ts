import type { ErrorRequestHandler } from "express";
import { HttpError } from "../utils/httpError.js";

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const error = err instanceof HttpError ? err : new HttpError(500, "Internal Server Error");

  res.status(error.statusCode).json({
    error: {
      message: error.message,
      code: error.code,
      details: error.details
    }
  });
};
