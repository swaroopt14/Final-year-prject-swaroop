import type { RequestHandler } from "express";
import { ok } from "../../utils/response.wrapper.js";
import { vitalsService } from "./vitals.service.js";

const createRecord: RequestHandler = async (req, res, next) => {
  try {
    const created = await vitalsService.createRecord(req.body);
    res.status(201).json(ok(created));
  } catch (e) {
    next(e);
  }
};

const listRecordsByPatient: RequestHandler = async (req, res, next) => {
  try {
    const patientId = String(req.query.patientId ?? "");
    const records = await vitalsService.listRecordsByPatient(patientId);
    res.json(ok(records));
  } catch (e) {
    next(e);
  }
};

export const vitalsController = {
  createRecord,
  listRecordsByPatient
};

