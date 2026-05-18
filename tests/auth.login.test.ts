import { describe, expect, it, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import request from "supertest";
import { app } from "../src/app.js";
import { HttpError } from "../src/utils/httpError.js";

const { loginMock, getUserByIdMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  getUserByIdMock: vi.fn()
}));

vi.mock("../src/modules/auth/auth.service.js", () => ({
  authService: {
    login: loginMock,
    getUserById: getUserByIdMock,
    cookieOptions: () => ({
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 28_800_000,
      secure: false
    }),
    hashPassword: vi.fn(),
    signToken: vi.fn()
  }
}));

const demoUser = {
  id: "user-1",
  email: "dr.rao@smartcare.dev",
  name: "Dr. Rao",
  role: "doctor" as const,
  department: "Neurology"
};

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    loginMock.mockReset();
    getUserByIdMock.mockReset();
  });

  it("returns 200, user payload, and sc_token cookie on success", async () => {
    loginMock.mockResolvedValueOnce({ token: "jwt-demo-token", user: demoUser });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "dr.rao@smartcare.dev", password: "demo1234" });

    expect(res.status).toBe(200);
    expect(res.body.data.user).toMatchObject(demoUser);
    expect(res.body.data.token).toBe("jwt-demo-token");
    const setCookie = res.headers["set-cookie"];
    expect(setCookie?.[0]).toMatch(/sc_token=jwt-demo-token/);
  });

  it("returns 401 for invalid credentials", async () => {
    loginMock.mockRejectedValueOnce(new HttpError(401, "Invalid email or password", "AUTH_INVALID"));

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "dr.rao@smartcare.dev", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.error?.code).toBe("AUTH_INVALID");
  });
});

describe("GET /api/auth/me", () => {
  beforeEach(() => {
    loginMock.mockReset();
    getUserByIdMock.mockReset();
  });

  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.error?.code).toBe("AUTH_REQUIRED");
  });

  it("returns 200 with bearer token", async () => {
    getUserByIdMock.mockResolvedValueOnce(demoUser);
    const token = jwt.sign(
      { sub: demoUser.id, role: demoUser.role, name: demoUser.name, email: demoUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject(demoUser);
    expect(getUserByIdMock).toHaveBeenCalledWith(demoUser.id);
  });
});
