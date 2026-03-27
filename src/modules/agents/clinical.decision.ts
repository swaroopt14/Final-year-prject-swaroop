import { findInteractions } from "../pharmacy/drug.rules.js";
import { orchestrator } from "./bootstrap.js";
import { runLangGraphWorkflow } from "./langgraph.client.js";
import type { ChiefConsensus, DoctorEvaluation, SafetyGate, UncertaintyBand } from "./agent.types.js";

type DecisionVitals = {
  heartRateBpm: number;
  systolicMmHg: number;
  diastolicMmHg: number;
  spo2Pct: number;
  temperatureC: number;
};

type DecisionInput = {
  patientId: string;
  noteText?: string;
  vitals?: DecisionVitals;
  drugs?: string[];
};

export type ClinicalDecisionCycle = {
  patientId: string;
  riskScore: number;
  riskLevel: "low" | "moderate" | "high";
  state: "low" | "medium" | "high";
  recommendedAction: "observe" | "admit" | "discharge";
  confidence: "low" | "medium" | "high";
  escalationRecommended: boolean;
  recommendations: string[];
  evidence: string[];
  parsedNote?: unknown;
  dependencies: {
    ml: { status: "ok" | "degraded"; model: string };
    bert: { status: "ok" | "degraded"; used: boolean };
    agentService: { status: "ok" | "degraded"; used: boolean };
  };
  chiefConsensus: ChiefConsensus;
  safetyGate: SafetyGate;
  workflow: unknown;
};

export function deriveUncertaintyBand(base: DoctorEvaluation, chief: ChiefConsensus): UncertaintyBand {
  if (
    base.confidence === "low" ||
    base.dependencies.ml.status === "degraded" ||
    base.dependencies.bert.status === "degraded" ||
    chief.finalPriority === "critical"
  ) {
    return "high";
  }
  if (base.confidence === "medium" || chief.finalPriority === "urgent") return "moderate";
  return "low";
}

export function deriveSafetyGate(base: DoctorEvaluation, chief: ChiefConsensus): SafetyGate {
  const reasons: string[] = [];
  if (base.riskLevel === "high") reasons.push("High model risk level requires attending approval.");
  if (chief.supervision !== "resident_autonomous") reasons.push(`Chief supervision level is ${chief.supervision}.`);
  if (base.confidence === "low") reasons.push("Resident confidence is low.");
  if (base.dependencies.ml.status === "degraded") reasons.push("ML dependency degraded.");
  if (base.dependencies.bert.status === "degraded") reasons.push("NLP dependency degraded.");

  const uncertaintyBand = deriveUncertaintyBand(base, chief);
  const attendingApprovalRequired =
    base.riskLevel === "high" ||
    chief.supervision !== "resident_autonomous" ||
    base.confidence === "low" ||
    uncertaintyBand === "high";
  const hardStop = chief.finalPriority === "critical" || (base.riskLevel === "high" && uncertaintyBand === "high");

  return {
    uncertaintyBand,
    attendingApprovalRequired,
    mayProceedWithoutAttending: !attendingApprovalRequired,
    hardStop,
    reasons: reasons.length ? reasons : ["No mandatory attending gate triggered."]
  };
}

export async function runClinicalDecisionCycle(input: DecisionInput): Promise<ClinicalDecisionCycle> {
  const base = await orchestrator.getDoctorAgent().evaluatePatient(input.patientId, input.noteText, {
    vitals: input.vitals
  });
  const interactions = findInteractions(input.drugs ?? []);
  const chiefConsensus = orchestrator.getChiefAgent().buildConsensus({
    doctor: base,
    vitals: input.vitals,
    interactions
  });
  const safetyGate = deriveSafetyGate(base, chiefConsensus);

  let workflow: unknown | undefined;
  let workflowStatus: "ok" | "degraded" = "ok";
  try {
    workflow = await runLangGraphWorkflow({
      patientId: input.patientId,
      riskScore: base.riskScore,
      vitals: input.vitals,
      drugs: input.drugs,
      noteText: input.noteText
    });
  } catch {
    workflowStatus = "degraded";
    workflow = { error: "LangGraph agent service unavailable" };
  }

  try {
    await orchestrator.logClinicalDecision({
      patientId: input.patientId,
      doctor: base,
      chiefConsensus,
      safetyGate
    });
  } catch {
    // Never fail clinical response due to audit write failures.
  }

  return {
    ...base,
    chiefConsensus,
    safetyGate,
    dependencies: {
      ...base.dependencies,
      agentService: { status: workflowStatus, used: true }
    },
    workflow
  };
}
