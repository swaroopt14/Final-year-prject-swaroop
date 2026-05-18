import mongoose, { Schema } from "mongoose";

export type UserRole = "doctor" | "nurse" | "admin";

export type UserDocument = {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  department?: string;
};

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ["doctor", "nurse", "admin"] },
    department: { type: String }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
