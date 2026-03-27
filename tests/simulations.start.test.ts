import { describe, expect, it, vi } from "vitest";
import { createMockRes, createNext } from "./helpers/http.js";

const { startSimulationMock, getSimulationMock } = vi.hoisted(() => ({
  startSimulationMock: vi.fn(),
  getSimulationMock: vi.fn()
}));

vi.mock("../src/modules/simulations/simulation.service.js", () => ({
  simulationService: {
    startSimulation: startSimulationMock,
    getSimulation: getSimulationMock
  }
}));

import { HttpError } from "../src/utils/httpError.js";
import { simulationController } from "../src/modules/simulations/simulation.controller.js";
import { startSimulationSchema } from "../src/modules/simulations/simulation.validation.js";

describe("simulationController", () => {
  it("starts simulation and returns monitor metadata", async () => {
    startSimulationMock.mockReturnValueOnce({
      simulationId: "sim-1",
      status: "starting",
      startedAt: "2026-03-06T12:00:00.000Z",
      endedAt: null,
      config: {
        patientCount: 2,
        durationSeconds: 30,
        updateIntervalMs: 1000,
        severityProfile: { highRiskPct: 50 }
      },
      patientIds: [],
      stats: {},
      error: null
    });

    const { res, state } = createMockRes();
    const next = createNext();
    await simulationController.start(
      {
        body: {
          patientCount: 2,
          durationSeconds: 30,
          updateIntervalMs: 1000,
          severityProfile: { highRiskPct: 50 }
        }
      } as any,
      res as any,
      next as any
    );

    expect(next).not.toHaveBeenCalled();
    expect(state.statusCode).toBe(202);
    expect((state.body as any).data.simulationId).toBe("sim-1");
    expect((state.body as any).data.monitor.sseEvent).toBe("simulation.status");
  });

  it("returns not found when simulation id is unknown", async () => {
    getSimulationMock.mockReturnValueOnce(null);

    const { res } = createMockRes();
    const next = createNext();
    await simulationController.getById(
      {
        params: { id: "missing" }
      } as any,
      res as any,
      next as any
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0]?.[0]).toBeInstanceOf(HttpError);
  });
});

describe("startSimulationSchema", () => {
  it("applies defaults", () => {
    const parsed = startSimulationSchema.parse({});
    expect(parsed.patientCount).toBe(5);
    expect(parsed.durationSeconds).toBe(60);
    expect(parsed.updateIntervalMs).toBe(2000);
    expect(parsed.severityProfile.highRiskPct).toBe(30);
  });
});
