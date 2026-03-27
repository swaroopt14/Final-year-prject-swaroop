import { z } from "zod";

export const createVitalRecordSchema = z.object({
  patientId: z.string().min(1),
  recordedAt: z.string().datetime().optional(),
  heartRateBpm: z.number().int().positive(),
  systolicMmHg: z.number().int().positive(),
  diastolicMmHg: z.number().int().positive(),
  spo2Pct: z.number().int().min(0).max(100),
  temperatureC: z.number()
});

