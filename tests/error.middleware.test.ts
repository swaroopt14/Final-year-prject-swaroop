import { describe, expect, it } from "vitest";
import { errorMiddleware } from "../src/middleware/error.middleware.js";
import { HttpError } from "../src/utils/httpError.js";
import { createMockRes } from "./helpers/http.js";

describe("errorMiddleware", () => {
  it("serializes HttpError with status/code/details", () => {
    const { res, state } = createMockRes();
    const err = new HttpError(404, "Patient not found", "NOT_FOUND", { id: "p1" });

    errorMiddleware(err, {} as any, res as any, (() => undefined) as any);

    expect(state.statusCode).toBe(404);
    expect(state.body).toEqual({
      error: {
        message: "Patient not found",
        code: "NOT_FOUND",
        details: { id: "p1" }
      }
    });
  });

  it("maps unknown errors to 500 internal error", () => {
    const { res, state } = createMockRes();
    errorMiddleware(new Error("boom"), {} as any, res as any, (() => undefined) as any);

    expect(state.statusCode).toBe(500);
    expect(state.body).toEqual({
      error: {
        message: "Internal Server Error",
        code: undefined,
        details: undefined
      }
    });
  });
});
