import { z } from "zod";

export const createLabReportSchema = z.object({
  patientId: z.string().min(1),
  reportType: z.string().min(1),
  reportedAt: z.string().datetime().optional(),
  summary: z.string().min(1),
  values: z.record(z.number())
});

export const ingestHl7Schema = z.object({
  message: z.string().min(1),
  reportType: z.string().min(1).default("HL7_OBSERVATION"),
  reportedAt: z.string().datetime().optional()
});
