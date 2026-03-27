import type { RequestHandler } from "express";
import { ok } from "../../utils/response.wrapper.js";
import { parseHl7 } from "../../utils/hl7.parser.js";
import { labService } from "./lab.service.js";

const createReport: RequestHandler = async (req, res, next) => {
  try {
    const created = await labService.createReport(req.body);
    res.status(201).json(ok(created));
  } catch (e) {
    next(e);
  }
};

const listReportsByPatient: RequestHandler = async (req, res, next) => {
  try {
    const patientId = String(req.query.patientId ?? "");
    const reports = await labService.listReportsByPatient(patientId);
    res.json(ok(reports));
  } catch (e) {
    next(e);
  }
};

const parseHl7Message: RequestHandler = async (req, res, next) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message : "";
    res.json(ok(parseHl7(message)));
  } catch (e) {
    next(e);
  }
};

const ingestHl7Message: RequestHandler = async (req, res, next) => {
  try {
    const out = await labService.ingestHl7(req.body);
    res.status(201).json(ok(out));
  } catch (e) {
    next(e);
  }
};

export const labController = {
  createReport,
  listReportsByPatient,
  parseHl7Message,
  ingestHl7Message
};
