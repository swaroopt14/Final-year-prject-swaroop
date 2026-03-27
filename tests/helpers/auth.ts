import jwt from "jsonwebtoken";

type Role = "doctor" | "nurse" | "admin";

export function authHeader(role: Role = "admin") {
  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign({ sub: "test-user", role }, secret, { expiresIn: "1h" });
  return { Authorization: `Bearer ${token}` };
}
