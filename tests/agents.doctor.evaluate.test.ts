import { describe, expect, it, vi } from "vitest";
import { createMockRes, createNext } from "./helpers/http.js";

const { runClinicalDecisionCycleMock } = vi.hoisted(() => ({
  runClinicalDecisionCycleMock: vi.fn()
}));

vi.mock("../src/modules/agents/clinical.decision.js", () => ({
  runClinicalDecisionCycle: runClinicalDecisionCycleMock
}));

import { agentsController } from "../src/modules/agents/agents.controller.js";

describe("agentsController.doctorEvaluate", () => {
  it("returns simulation-ready clinical output", async () => {
    runClinicalDecisionCycleMock.mockResolvedValueOnce({
      patientId: "p1",
      riskScore: 0.84,
      riskLevel: "high",
      state: "high",
      recommendedAction: "admit",
      confidence: "high",
      escalationRecommended: true,
      recommendations: [],
      evidence: [],
      parsedNote: { summary: "High acuity." },
      chiefConsensus: {
        finalPriority: "critical",
        finalAction: "admit",
        supervision: "attending_immediate",
        disagreement: false,
        rationale: ["Mocked chief consensus"]
      },
      safetyGate: {
        uncertaintyBand: "high",
        attendingApprovalRequired: true,
        mayProceedWithoutAttending: false,
        hardStop: true,
        reasons: ["Mocked safety gate"]
      },
      dependencies: {
        ml: { status: "ok", model: "random_forest" },
        bert: { status: "ok", used: true },
        agentService: { status: "degraded", used: true }
      },
      workflow: { error: "LangGraph agent service unavailable" }
    });

    const { res, state } = createMockRes();
    const next = createNext();
    await agentsController.doctorEvaluate(
      {
        body: {
          patientId: "p1",
          noteText: "Patient has worsening oxygenation",
          drugs: ["warfarin", "aspirin"],
          vitals: {
            heartRateBpm: 138,
            systolicMmHg: 185,
            diastolicMmHg: 121,
            spo2Pct: 89,
            temperatureC: 39.8
          }
        }
      } as any,
      res as any,
      next as any
    );

    expect(next).not.toHaveBeenCalled();
    expect(state.statusCode).toBe(200);
    const body = state.body as any;
    expect(body.data.patientId).toBe("p1");
    expect(body.data.chiefConsensus).toBeDefined();
    expect(body.data.safetyGate.hardStop).toBe(true);
    expect(body.data.dependencies.agentService.status).toBe("degraded");
    expect(body.data.workflow.error).toContain("LangGraph agent service unavailable");
    expect(runClinicalDecisionCycleMock).toHaveBeenCalledTimes(1);
  });

  it("forwards errors to next()", async () => {
    runClinicalDecisionCycleMock.mockRejectedValueOnce(new Error("failed"));

    const { res } = createMockRes();
    const next = createNext();
    await agentsController.doctorEvaluate(
      {
        body: {
          patientId: "p1"
        }
      } as any,
      res as any,
      next as any
    );

    expect(next).toHaveBeenCalledTimes(1);
  });
});
