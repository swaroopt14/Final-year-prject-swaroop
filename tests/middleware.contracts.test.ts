import { describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { authMiddleware } from "../src/middleware/auth.middleware.js";
import { authQueryMiddleware } from "../src/middleware/authQuery.middleware.js";
import { requireRole } from "../src/middleware/role.middleware.js";
import { validateBody } from "../src/middleware/validate.middleware.js";
import { HttpError } from "../src/utils/httpError.js";
import { createNext } from "./helpers/http.js";

function testToken(role: "doctor" | "nurse" | "admin" = "doctor") {
  return jwt.sign({ sub: "test-user", role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
}

describe("authMiddleware", () => {
  it("attaches req.user for a valid bearer token", () => {
    const token = testToken("doctor");
    const req: any = {
      header: (name: string) => (name.toLowerCase() === "authorization" ? `Bearer ${token}` : undefined)
    };
    const next = createNext();

    authMiddleware(req, {} as any, next as any);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toMatchObject({ sub: "test-user", role: "doctor" });
  });

  it("returns AUTH_REQUIRED when authorization header is missing", () => {
    const req: any = { header: () => undefined };
    const next = createNext();

    authMiddleware(req, {} as any, next as any);

    const err = next.mock.calls[0]?.[0] as HttpError;
    expect(err).toBeInstanceOf(HttpError);
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe("AUTH_REQUIRED");
  });

  it("returns AUTH_INVALID for invalid bearer token", () => {
    const req: any = {
      header: (name: string) => (name.toLowerCase() === "authorization" ? "Bearer bad-token" : undefined)
    };
    const next = createNext();

    authMiddleware(req, {} as any, next as any);

    const err = next.mock.calls[0]?.[0] as HttpError;
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe("AUTH_INVALID");
  });
});

describe("authQueryMiddleware", () => {
  it("attaches req.user when token query param is valid", () => {
    const req: any = {
      query: { token: testToken("admin") }
    };
    const next = createNext();

    authQueryMiddleware(req, {} as any, next as any);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toMatchObject({ sub: "test-user", role: "admin" });
  });

  it("returns AUTH_REQUIRED when query token is absent", () => {
    const req: any = { query: {} };
    const next = createNext();

    authQueryMiddleware(req, {} as any, next as any);

    const err = next.mock.calls[0]?.[0] as HttpError;
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe("AUTH_REQUIRED");
  });
});

describe("requireRole", () => {
  it("allows authorized role", () => {
    const middleware = requireRole(["doctor", "admin"]);
    const req: any = { user: { sub: "u1", role: "doctor" } };
    const next = createNext();

    middleware(req, {} as any, next as any);

    expect(next).toHaveBeenCalledWith();
  });

  it("returns FORBIDDEN for unauthorized role", () => {
    const middleware = requireRole(["admin"]);
    const req: any = { user: { sub: "u1", role: "nurse" } };
    const next = createNext();

    middleware(req, {} as any, next as any);

    const err = next.mock.calls[0]?.[0] as HttpError;
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe("FORBIDDEN");
  });
});

describe("validateBody", () => {
  const schema = z.object({
    patientId: z.string().min(1),
    threshold: z.coerce.number().min(0).max(1)
  });

  it("parses and coerces request body", () => {
    const middleware = validateBody(schema);
    const req: any = { body: { patientId: "p1", threshold: "0.8" } };
    const next = createNext();

    middleware(req, {} as any, next as any);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ patientId: "p1", threshold: 0.8 });
  });

  it("returns VALIDATION_ERROR when schema check fails", () => {
    const middleware = validateBody(schema);
    const req: any = { body: { patientId: "", threshold: 3 } };
    const next = createNext();

    middleware(req, {} as any, next as any);

    const err = next.mock.calls[0]?.[0] as HttpError;
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.details).toBeDefined();
  });
});
