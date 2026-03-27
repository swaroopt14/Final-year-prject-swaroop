import mongoose from "mongoose";
import { env } from "./env.config.js";

export async function connectToDatabase() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production"
  });
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect();
}

