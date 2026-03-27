import type { RequestHandler } from "express";
import { HttpError } from "../../utils/httpError.js";
import { ok } from "../../utils/response.wrapper.js";
import { simulationService } from "./simulation.service.js";

const start: RequestHandler = async (req, res, next) => {
  try {
    const run = simulationService.startSimulation(req.body);
    res.status(202).json(
      ok({
        ...run,
        monitor: {
          sseEvent: "simulation.status",
          endpoint: "/api/events/stream"
        }
      })
    );
  } catch (e) {
    next(e);
  }
};

const getById: RequestHandler = async (req, res, next) => {
  try {
    const run = simulationService.getSimulation(req.params.id);
    if (!run) throw new HttpError(404, "Simulation not found", "NOT_FOUND");
    res.json(ok(run));
  } catch (e) {
    next(e);
  }
};

export const simulationController = {
  start,
  getById
};
