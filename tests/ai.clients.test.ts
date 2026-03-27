import { describe, expect, it, vi } from "vitest";
import axios from "axios";

vi.mock("axios", () => ({
  default: {
    post: vi.fn()
  }
}));

import { predictRisk } from "../src/ai/ml/ml.client.js";
import { parseClinicalNote } from "../src/ai/nlp/bert.service.js";
import { QLearningService } from "../src/ai/rl/qlearning.service.js";

describe("AI clients contract alignment", () => {
  it("predictRisk prefers /predict/risk and falls back to /predict", async () => {
    const mockedPost = vi.mocked(axios.post);
    mockedPost.mockRejectedValueOnce(new Error("404"));
    mockedPost.mockResolvedValueOnce({ data: { prediction: { risk_score: 0.62, model: "fallback" } } });

    const out = await predictRisk({ age: 65, num_comorbidities: 2 });

    expect(out.risk_score).toBe(0.62);
    expect(mockedPost.mock.calls[0]?.[0]).toContain("/predict/risk");
    expect(mockedPost.mock.calls[1]?.[0]).toContain("/predict");
  });

  it("parseClinicalNote prefers /analyze/notes and falls back to BERT endpoint", async () => {
    const mockedPost = vi.mocked(axios.post);
    mockedPost.mockRejectedValueOnce(new Error("service down"));
    mockedPost.mockResolvedValueOnce({ data: { summary: "fallback summary", entities: [] } });

    const out = await parseClinicalNote("Patient has chest pain.");

    expect(out.summary).toBe("fallback summary");
    expect(mockedPost.mock.calls[0]?.[0]).toContain("/analyze/notes");
    expect(typeof mockedPost.mock.calls[1]?.[0]).toBe("string");
  });

  it("qlearning updateAndSync updates local Q table even if remote sync fails", async () => {
    const mockedPost = vi.mocked(axios.post);
    mockedPost.mockRejectedValueOnce(new Error("network error"));

    const q = new QLearningService<"stable" | "alert", "observe" | "escalate">();
    await q.updateAndSync("alert", "escalate", 1, "alert");

    expect(q.getQ("alert", "escalate")).toBeGreaterThan(0);
    expect(mockedPost).toHaveBeenCalledTimes(1);
    expect(mockedPost.mock.calls[0]?.[0]).toContain("/qlearning/update");
  });
});
