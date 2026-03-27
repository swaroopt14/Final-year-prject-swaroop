import { z } from "zod";

export const startSimulationSchema = z.object({
  patientCount: z.number().int().min(1).max(50).default(5),
  durationSeconds: z.number().int().min(5).max(900).default(60),
  updateIntervalMs: z.number().int().min(250).max(30_000).default(2_000),
  severityProfile: z
    .object({
      highRiskPct: z.number().min(0).max(100).default(30)
    })
    .default({ highRiskPct: 30 }),
  seed: z.number().int().optional()
});

export type StartSimulationInput = z.infer<typeof startSimulationSchema>;
