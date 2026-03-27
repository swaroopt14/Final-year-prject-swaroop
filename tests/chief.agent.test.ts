import { describe, expect, it } from "vitest";
import { ChiefAgent } from "../src/modules/agents/chief.agent.js";

describe("ChiefAgent.buildConsensus", () => {
  it("overrides to admit with attending_immediate on critical vitals", () => {
    const chief = new ChiefAgent();
    const out = chief.buildConsensus({
      doctor: {
        patientId: "p1",
        riskScore: 0.45,
        riskLevel: "moderate",
        state: "medium",
        recommendedAction: "observe",
        confidence: "medium",
        escalationRecommended: false,
        recommendations: [],
        evidence: [],
        dependencies: {
          ml: { status: "ok", model: "random_forest" },
          bert: { status: "ok", used: true }
        }
      },
      vitals: {
        heartRateBpm: 140,
        systolicMmHg: 188,
        diastolicMmHg: 122,
        spo2Pct: 89,
        temperatureC: 39.8
      },
      interactions: []
    });

    expect(out.finalPriority).toBe("critical");
    expect(out.finalAction).toBe("admit");
    expect(out.supervision).toBe("attending_immediate");
    expect(out.disagreement).toBe(true);
  });

  it("raises supervision on severe drug interaction", () => {
    const chief = new ChiefAgent();
    const out = chief.buildConsensus({
      doctor: {
        patientId: "p1",
        riskScore: 0.35,
        riskLevel: "low",
        state: "low",
        recommendedAction: "observe",
        confidence: "high",
        escalationRecommended: false,
        recommendations: [],
        evidence: [],
        dependencies: {
          ml: { status: "ok", model: "random_forest" },
          bert: { status: "ok", used: false }
        }
      },
      interactions: [{ a: "warfarin", b: "aspirin", severity: "high", note: "Increased bleeding risk." }]
    });

    expect(out.finalPriority).toBe("urgent");
    expect(out.supervision).toBe("attending_review");
    expect(out.disagreement).toBe(false);
  });
});
