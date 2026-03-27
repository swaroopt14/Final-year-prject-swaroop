import { z } from "zod";

export const checkPrescriptionSchema = z.object({
  patientId: z.string().min(1),
  drugs: z.array(z.string().min(1)).min(1),
  noteText: z.string().optional()
});

