import { describe, expect, it, vi } from "vitest";

const { findByIdMock, predictRiskMock, parseClinicalNoteMock, publishMock } = vi.hoisted(() => ({
  findByIdMock: vi.fn(),
  predictRiskMock: vi.fn(),
  parseClinicalNoteMock: vi.fn(),
  publishMock: vi.fn()
}));

vi.mock("../src/modules/ehr/ehr.model.js", () => ({
  PatientModel: {
    findById: findByIdMock
  }
}));

vi.mock("../src/ai/ml/ml.client.js", () => ({
  predictRisk: predictRiskMock
}));

vi.mock("../src/ai/nlp/bert.service.js", () => ({
  parseClinicalNote: parseClinicalNoteMock
}));

vi.mock("../src/events/index.js", () => ({
  eventBus: {
    publish: publishMock
  }
}));

import { DoctorAgent } from "../src/modules/agents/doctor.agent.js";
import { Topics } from "../src/events/topics.js";

describe("DoctorAgent.evaluatePatient", () => {
  it("returns high-risk recommendation and publishes alert", async () => {
    findByIdMock.mockReturnValueOnce({
      lean: () => ({
        exec: async () => ({
          _id: "p1",
          dateOfBirth: new Date("1968-04-12"),
          comorbidities: ["hypertension", "ckd"]
        })
      })
    });
    predictRiskMock.mockResolvedValueOnce({ risk_score: 0.91, model: "random_forest" });
    parseClinicalNoteMock.mockResolvedValueOnce({ summary: "Likely severe deterioration." });

    const agent = new DoctorAgent();
    const out = await agent.evaluatePatient("p1", "Patient has low oxygen saturation");

    expect(out.state).toBe("high");
    expect(out.riskLevel).toBe("high");
    expect(out.recommendedAction).toBe("observe");
    expect(out.confidence).toBe("high");
    expect(out.escalationRecommended).toBe(true);
    expect(out.evidence.length).toBeGreaterThan(0);
    expect(out.dependencies.ml.status).toBe("ok");
    expect(out.dependencies.bert.status).toBe("ok");
    expect(publishMock).toHaveBeenCalledTimes(1);
    expect(publishMock).toHaveBeenCalledWith(
      Topics.highRiskAlert,
      expect.objectContaining({
        patientId: "p1",
        source: "doctor",
        riskScore: 0.91
      })
    );
  });

  it("marks dependencies degraded when ML and BERT fail", async () => {
    findByIdMock.mockReturnValueOnce({
      lean: () => ({
        exec: async () => ({
          _id: "p2",
          dateOfBirth: new Date("1990-01-21"),
          comorbidities: []
        })
      })
    });
    predictRiskMock.mockRejectedValueOnce(new Error("ml down"));
    parseClinicalNoteMock.mockRejectedValueOnce(new Error("bert down"));

    const agent = new DoctorAgent();
    const out = await agent.evaluatePatient("p2", "Note text");

    expect(out.riskScore).toBe(0);
    expect(out.state).toBe("low");
    expect(out.riskLevel).toBe("low");
    expect(out.confidence).toBe("low");
    expect(out.escalationRecommended).toBe(true);
    expect(out.dependencies.ml.status).toBe("degraded");
    expect(out.dependencies.bert.status).toBe("degraded");
    expect(out.parsedNote).toEqual({ error: "BERT inference unavailable" });
  });
});
