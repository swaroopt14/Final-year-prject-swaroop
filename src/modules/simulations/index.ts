import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { validateBody } from "../../middleware/validate.middleware.js";
import { simulationController } from "./simulation.controller.js";
import { startSimulationSchema } from "./simulation.validation.js";

export const simulationsRouter = Router();

simulationsRouter.post(
  "/start",
  authMiddleware,
  requireRole(["admin", "doctor"]),
  validateBody(startSimulationSchema),
  simulationController.start
);

simulationsRouter.get(
  "/:id",
  authMiddleware,
  requireRole(["doctor", "nurse", "admin"]),
  simulationController.getById
);
