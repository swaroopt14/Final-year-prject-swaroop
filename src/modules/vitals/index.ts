import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { validateBody } from "../../middleware/validate.middleware.js";
import { vitalsController } from "./vitals.controller.js";
import { createVitalRecordSchema } from "./vitals.validation.js";

export const vitalsRouter = Router();

vitalsRouter.get("/records", authMiddleware, requireRole(["doctor", "nurse", "admin"]), vitalsController.listRecordsByPatient);
vitalsRouter.post(
  "/records",
  authMiddleware,
  requireRole(["nurse", "admin"]),
  validateBody(createVitalRecordSchema),
  vitalsController.createRecord
);

