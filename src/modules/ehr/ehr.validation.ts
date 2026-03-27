import { z } from "zod";

export const createPatientSchema = z.object({
  mrn: z.string().min(3),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  sex: z.enum(["male", "female", "other", "unknown"]).default("unknown"),
  phone: z.string().optional(),
  address: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  comorbidities: z.array(z.string()).default([])
});

export const updatePatientSchema = createPatientSchema.partial().refine((v) => Object.keys(v).length > 0, {
  message: "At least one field must be provided"
});
