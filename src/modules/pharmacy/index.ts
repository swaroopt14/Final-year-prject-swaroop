import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { validateBody } from "../../middleware/validate.middleware.js";
import { pharmacyController } from "./pharmacy.controller.js";
import { checkPrescriptionSchema } from "./pharmacy.validation.js";

export const pharmacyRouter = Router();

pharmacyRouter.post(
  "/prescription/check",
  authMiddleware,
  requireRole(["doctor", "admin"]),
  validateBody(checkPrescriptionSchema),
  pharmacyController.checkPrescription
);

