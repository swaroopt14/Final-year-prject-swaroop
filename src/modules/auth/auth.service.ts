import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.config.js";
import type { AuthUser } from "../../middleware/auth.middleware.js";
import { HttpError } from "../../utils/httpError.js";
import { UserModel, type UserDocument, type UserRole } from "./auth.model.js";

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
};

const TOKEN_MAX_AGE_MS = 8 * 60 * 60 * 1000;

function toPublicUser(doc: UserDocument & { _id: { toString(): string } }): PublicUser {
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    role: doc.role,
    department: doc.department
  };
}

function toAuthClaims(user: PublicUser): AuthUser {
  return {
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    department: user.department
  };
}

export const authService = {
  signToken(user: PublicUser): string {
    return jwt.sign(toAuthClaims(user), env.JWT_SECRET, { expiresIn: "8h" });
  },

  cookieOptions() {
    return {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: TOKEN_MAX_AGE_MS,
      secure: env.NODE_ENV === "production"
    };
  },

  async login(email: string, password: string): Promise<{ token: string; user: PublicUser }> {
    const doc = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!doc) {
      throw new HttpError(401, "Invalid email or password", "AUTH_INVALID");
    }

    const valid = await bcrypt.compare(password, doc.passwordHash);
    if (!valid) {
      throw new HttpError(401, "Invalid email or password", "AUTH_INVALID");
    }

    const user = toPublicUser(doc);
    return { token: this.signToken(user), user };
  },

  async getUserById(id: string): Promise<PublicUser> {
    const doc = await UserModel.findById(id);
    if (!doc) {
      throw new HttpError(401, "User not found", "AUTH_INVALID");
    }
    return toPublicUser(doc);
  },

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
};
