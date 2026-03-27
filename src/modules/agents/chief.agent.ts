import { isHighRiskVitals } from "../../utils/risk.calculator.js";
import type { DrugInteraction } from "../pharmacy/drug.rules.js";
import type { ChiefConsensus, DoctorEvaluation } from "./agent.types.js";

type ConsensusInput = {
  doctor: DoctorEvaluation;
  vitals?: {
    heartRateBpm: number;
    systolicMmHg: number;
    diastolicMmHg: number;
    spo2Pct: number;
    temperatureC: number;
  };
  interactions?: DrugInteraction[];
};

export class ChiefAgent {
  buildConsensus(input: ConsensusInput): ChiefConsensus {
    const rationale: string[] = [];
    const vitalsCritical = input.vitals ? isHighRiskVitals(input.vitals) : false;
    const severeInteraction = (input.interactions ?? []).some((x) => x.severity === "high");

    let finalAction = input.doctor.recommendedAction;
    let finalPriority: ChiefConsensus["finalPriority"] = "routine";
    let supervision: ChiefConsensus["supervision"] = "resident_autonomous";

    if (input.doctor.riskLevel === "high") {
      finalPriority = "urgent";
      supervision = "attending_review";
      rationale.push("Doctor agent risk score indicates high clinical risk.");
    }

    if (vitalsCritical) {
      finalPriority = "critical";
      finalAction = "admit";
      supervision = "attending_immediate";
      rationale.push("Nurse triage indicates critical vital-sign abnormalities.");
    }

    if (severeInteraction) {
      if (finalPriority === "routine") finalPriority = "urgent";
      supervision = supervision === "attending_immediate" ? supervision : "attending_review";
      rationale.push("Drug checker flagged severe medication interaction risk.");
    }

    if (input.doctor.confidence === "low") {
      supervision = "attending_review";
      rationale.push("Doctor agent confidence is low; requires senior review.");
    }

    const disagreement = finalAction !== input.doctor.recommendedAction;
    if (disagreement) {
      rationale.push("Chief agent overrode doctor action due to cross-agent safety signals.");
    }

    if (rationale.length === 0) {
      rationale.push("No high-risk cross-agent signals; proceed with resident recommendation.");
    }

    return {
      finalPriority,
      finalAction,
      supervision,
      disagreement,
      rationale
    };
  }
}
