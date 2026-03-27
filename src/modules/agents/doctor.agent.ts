import { PatientModel } from "../ehr/ehr.model.js";
import { eventBus } from "../../events/index.js";
import { Topics } from "../../events/topics.js";
import { predictRisk } from "../../ai/ml/ml.client.js";
import { parseClinicalNote } from "../../ai/nlp/bert.service.js";
import { QLearningService } from "../../ai/rl/qlearning.service.js";
import type { DoctorEvaluation, HighRiskAlertEvent, ResidentConfidence, RiskLevel } from "./agent.types.js";
import { HttpError } from "../../utils/httpError.js";

type State = "low" | "medium" | "high";
type Action = "observe" | "admit" | "discharge";

type DependencyStatus = "ok" | "degraded";
type EvalContext = {
  vitals?: {
    heartRateBpm: number;
    systolicMmHg: number;
    diastolicMmHg: number;
    spo2Pct: number;
    temperatureC: number;
  };
};

export class DoctorAgent {
  private q = new QLearningService<State, Action>();

  async evaluatePatient(patientId: string, noteText?: string, context?: EvalContext): Promise<DoctorEvaluation> {
    const patient = await PatientModel.findById(patientId).lean().exec();
    if (!patient) throw new HttpError(404, "Patient not found", "NOT_FOUND");

    let prediction: { risk_score: number; model?: string } | undefined;
    let mlStatus: DependencyStatus = "ok";
    try {
      prediction = await predictRisk({
        age: Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / 31_557_600_000),
        num_comorbidities: Array.isArray(patient.comorbidities) ? patient.comorbidities.length : 0,
        systolicMmHg: context?.vitals?.systolicMmHg ?? 120,
        spo2Pct: context?.vitals?.spo2Pct ?? 96,
        temperatureC: context?.vitals?.temperatureC ?? 37
      });
    } catch {
      mlStatus = "degraded";
      prediction = { risk_score: 0 };
    }

    const riskScore = prediction?.risk_score ?? 0;
    const riskLevel: RiskLevel = riskScore >= 0.8 ? "high" : riskScore >= 0.5 ? "moderate" : "low";
    const state: State = riskScore >= 0.8 ? "high" : riskScore >= 0.5 ? "medium" : "low";
    const actions = ["observe", "admit", "discharge"] as const;
    const bestAction = this.q.getBestAction(state, actions) ?? (state === "high" ? "admit" : "observe");

    let parsedNote: unknown | undefined;
    let bertStatus: DependencyStatus = "ok";
    if (noteText) {
      try {
        parsedNote = await parseClinicalNote(noteText);
      } catch {
        bertStatus = "degraded";
        parsedNote = { error: "BERT inference unavailable" };
      }
    }

    if (riskScore >= 0.8) {
      await eventBus.publish(Topics.highRiskAlert, {
        patientId,
        source: "doctor",
        reason: "ML risk score exceeded threshold",
        riskScore,
        at: new Date().toISOString()
      } satisfies HighRiskAlertEvent);
    }

    const evidence: string[] = [];
    const age = Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / 31_557_600_000);
    evidence.push(`Age ${age} years.`);
    evidence.push(`Comorbidity count ${(patient.comorbidities ?? []).length}.`);
    if (context?.vitals) {
      evidence.push(
        `Vitals HR ${context.vitals.heartRateBpm}, BP ${context.vitals.systolicMmHg}/${context.vitals.diastolicMmHg}, SpO2 ${context.vitals.spo2Pct}, Temp ${context.vitals.temperatureC}.`
      );
    }
    if (mlStatus === "degraded") evidence.push("ML service unavailable; used conservative fallback score.");
    if (noteText && bertStatus === "degraded") evidence.push("NLP note parser unavailable; note evidence may be incomplete.");

    const confidence: ResidentConfidence =
      mlStatus === "degraded" || (noteText && bertStatus === "degraded")
        ? "low"
        : riskScore >= 0.8
          ? "high"
          : "medium";
    const escalationRecommended = riskLevel === "high" || confidence === "low";
    const recommendations =
      riskLevel === "high"
        ? ["Initiate attending review immediately.", "Place patient under high-acuity monitoring.", "Reconcile medications urgently."]
        : riskLevel === "moderate"
          ? ["Increase observation frequency.", "Reassess within 30 minutes.", "Order targeted follow-up labs."]
          : ["Continue routine monitoring.", "Document current stability and reassess per protocol."];

    return {
      patientId,
      riskScore,
      riskLevel,
      state,
      recommendedAction: bestAction,
      confidence,
      escalationRecommended,
      recommendations,
      evidence,
      parsedNote,
      dependencies: {
        ml: { status: mlStatus, model: prediction?.model ?? "unknown" },
        bert: { status: noteText ? bertStatus : "ok", used: Boolean(noteText) }
      }
    };
  }
}
