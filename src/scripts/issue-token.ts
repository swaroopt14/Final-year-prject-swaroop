import jwt from "jsonwebtoken";
import { env } from "../config/env.config.js";
import type { AuthUser } from "../middleware/auth.middleware.js";

function readArg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const role = (readArg("role") ?? "admin") as AuthUser["role"];
const sub = readArg("sub") ?? "demo-user";

const token = jwt.sign({ sub, role } satisfies AuthUser, env.JWT_SECRET, { expiresIn: "8h" });
// eslint-disable-next-line no-console
console.log(token);

