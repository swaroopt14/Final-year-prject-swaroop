import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { validateBody } from "../../middleware/validate.middleware.js";
import { agentsController } from "./agents.controller.js";
import { doctorEvaluateSchema } from "./agents.validation.js";

export const agentsRouter = Router();

agentsRouter.get(
  "/health",
  authMiddleware,
  requireRole(["doctor", "nurse", "admin"]),
  agentsController.health
);
agentsRouter.get(
  "/decisions",
  authMiddleware,
  requireRole(["doctor", "nurse", "admin"]),
  agentsController.listClinicalDecisions
);

agentsRouter.post(
  "/doctor/evaluate",
  authMiddleware,
  requireRole(["doctor", "admin"]),
  validateBody(doctorEvaluateSchema),
  agentsController.doctorEvaluate
);
