import { Schema, model } from "mongoose";

export type Patient = {
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  sex: "male" | "female" | "other" | "unknown";
  phone?: string;
  address?: string;
  allergies: string[];
  comorbidities: string[];
  createdAt: Date;
  updatedAt: Date;
};

const patientSchema = new Schema<Patient>(
  {
    mrn: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    sex: { type: String, required: true, enum: ["male", "female", "other", "unknown"], default: "unknown" },
    phone: { type: String },
    address: { type: String },
    allergies: { type: [String], default: [] },
    comorbidities: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const PatientModel = model<Patient>("Patient", patientSchema);

