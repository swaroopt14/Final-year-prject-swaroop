import { describe, expect, it, vi } from "vitest";
import axios from "axios";
import { agentsController } from "../src/modules/agents/agents.controller.js";
import { createMockRes } from "./helpers/http.js";

vi.mock("axios", () => ({
  default: {
    get: vi.fn()
  }
}));

describe("GET /api/agents/health", () => {
  it("returns dependency health status", async () => {
    const mockedGet = vi.mocked(axios.get);
    mockedGet
      .mockResolvedValueOnce({ data: { status: "ok", random_forest_loaded: true } })
      .mockResolvedValueOnce({ data: { status: "ok" } })
      .mockRejectedValueOnce(new Error("connect ECONNREFUSED 127.0.0.1:8001"));

    const { res, state } = createMockRes();
    await agentsController.health({} as any, res as any, vi.fn());

    expect(state.statusCode).toBe(200);
    const body = state.body as any;
    expect(body.data.services.ml.status).toBe("ok");
    expect(body.data.services.agentService.status).toBe("ok");
    expect(body.data.services.bert.status).toBe("degraded");
    expect(mockedGet).toHaveBeenCalledTimes(3);
  });
});
