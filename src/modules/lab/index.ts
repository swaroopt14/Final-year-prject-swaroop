import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { validateBody } from "../../middleware/validate.middleware.js";
import { labController } from "./lab.controller.js";
import { createLabReportSchema, ingestHl7Schema } from "./lab.validation.js";

export const labRouter = Router();

labRouter.get("/reports", authMiddleware, requireRole(["doctor", "nurse", "admin"]), labController.listReportsByPatient);
labRouter.post(
  "/reports",
  authMiddleware,
  requireRole(["doctor", "admin"]),
  validateBody(createLabReportSchema),
  labController.createReport
);
labRouter.post("/hl7/parse", authMiddleware, requireRole(["doctor", "admin"]), labController.parseHl7Message);
labRouter.post(
  "/hl7/ingest",
  authMiddleware,
  requireRole(["doctor", "admin"]),
  validateBody(ingestHl7Schema),
  labController.ingestHl7Message
);
