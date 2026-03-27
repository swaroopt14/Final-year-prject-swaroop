import { z } from "zod";

export const doctorEvaluateSchema = z.object({
  patientId: z.string().min(1),
  noteText: z.string().optional(),
  vitals: z.record(z.unknown()).optional(),
  drugs: z.array(z.string()).optional()
});

export const decisionsQuerySchema = z.object({
  patientId: z.string().min(1).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});
