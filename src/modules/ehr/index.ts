import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { validateBody } from "../../middleware/validate.middleware.js";
import { ehrController } from "./ehr.controller.js";
import { createPatientSchema, updatePatientSchema } from "./ehr.validation.js";

export const ehrRouter = Router();

ehrRouter.get("/patients", authMiddleware, requireRole(["doctor", "nurse", "admin"]), ehrController.listPatients);
ehrRouter.get("/patients/:id", authMiddleware, requireRole(["doctor", "nurse", "admin"]), ehrController.getPatient);
ehrRouter.get(
  "/patients/:id/fhir",
  authMiddleware,
  requireRole(["doctor", "nurse", "admin"]),
  ehrController.getPatientFhir
);
ehrRouter.post(
  "/patients",
  authMiddleware,
  requireRole(["admin"]),
  validateBody(createPatientSchema),
  ehrController.createPatient
);
ehrRouter.patch(
  "/patients/:id",
  authMiddleware,
  requireRole(["admin"]),
  validateBody(updatePatientSchema),
  ehrController.updatePatient
);
