import type { DrugInteraction } from "../pharmacy/drug.rules.js";

export type VitalsStreamEvent = {
  patientId: string;
  recordedAt: string;
  heartRateBpm: number;
  systolicMmHg: number;
  diastolicMmHg: number;
  spo2Pct: number;
  temperatureC: number;
};

export type HighRiskAlertEvent = {
  patientId: string;
  source: "nurse" | "doctor";
  reason: string;
  at: string;
  riskScore?: number;
};

export type DrugAlertEvent = {
  patientId: string;
  interactions: DrugInteraction[];
  at: string;
};

export type ResidentConfidence = "low" | "medium" | "high";
export type RiskLevel = "low" | "moderate" | "high";
export type SupervisionLevel = "resident_autonomous" | "attending_review" | "attending_immediate";
export type UncertaintyBand = "low" | "moderate" | "high";

export type DoctorEvaluation = {
  patientId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  state: "low" | "medium" | "high";
  recommendedAction: "observe" | "admit" | "discharge";
  confidence: ResidentConfidence;
  escalationRecommended: boolean;
  recommendations: string[];
  evidence: string[];
  parsedNote?: unknown;
  dependencies: {
    ml: { status: "ok" | "degraded"; model: string };
    bert: { status: "ok" | "degraded"; used: boolean };
  };
};

export type ChiefConsensus = {
  finalPriority: "routine" | "urgent" | "critical";
  finalAction: "observe" | "admit" | "discharge";
  supervision: SupervisionLevel;
  disagreement: boolean;
  rationale: string[];
};

export type SafetyGate = {
  uncertaintyBand: UncertaintyBand;
  attendingApprovalRequired: boolean;
  mayProceedWithoutAttending: boolean;
  hardStop: boolean;
  reasons: string[];
};
