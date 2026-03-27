import { describe, expect, it, vi } from "vitest";
import { createMockRes, createNext } from "./helpers/http.js";

const { listClinicalDecisionsMock } = vi.hoisted(() => ({
  listClinicalDecisionsMock: vi.fn()
}));

vi.mock("../src/modules/agents/bootstrap.js", () => ({
  orchestrator: {
    listClinicalDecisions: listClinicalDecisionsMock
  }
}));

import { agentsController } from "../src/modules/agents/agents.controller.js";

describe("agentsController.listClinicalDecisions", () => {
  it("returns filtered decision audit items", async () => {
    listClinicalDecisionsMock.mockResolvedValueOnce({
      items: [
        {
          topic: "agents.clinical_decision",
          at: "2026-03-06T12:00:00.000Z",
          payload: { patientId: "p1", safetyGate: { hardStop: true } }
        }
      ],
      nextCursor: "abc123"
    });

    const { res, state } = createMockRes();
    const next = createNext();
    await agentsController.listClinicalDecisions(
      {
        query: { patientId: "p1", limit: "5" }
      } as any,
      res as any,
      next as any
    );

    expect(next).not.toHaveBeenCalled();
    expect(state.statusCode).toBe(200);
    const body = state.body as any;
    expect(body.data.count).toBe(1);
    expect(body.data.filters.patientId).toBe("p1");
    expect(body.data.paging.nextCursor).toBe("abc123");
    expect(listClinicalDecisionsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        patientId: "p1",
        limit: 5
      })
    );
  });

  it("forwards validation errors for bad query params", async () => {
    const { res } = createMockRes();
    const next = createNext();
    await agentsController.listClinicalDecisions(
      {
        query: { limit: "5000" }
      } as any,
      res as any,
      next as any
    );

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0]?.[0] as any;
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
  });

  it("returns validation error for invalid cursor", async () => {
    listClinicalDecisionsMock.mockRejectedValueOnce(new Error("invalid cursor timestamp"));

    const { res } = createMockRes();
    const next = createNext();
    await agentsController.listClinicalDecisions(
      {
        query: { cursor: "bad_cursor" }
      } as any,
      res as any,
      next as any
    );

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0]?.[0] as any;
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
  });
});
