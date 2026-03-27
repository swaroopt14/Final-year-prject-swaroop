import type { RequestHandler } from "express";
import { ok } from "../../utils/response.wrapper.js";
import { ehrService } from "./ehr.service.js";

const listPatients: RequestHandler = async (_req, res, next) => {
  try {
    const patients = await ehrService.listPatients();
    res.json(ok(patients));
  } catch (e) {
    next(e);
  }
};

const getPatient: RequestHandler = async (req, res, next) => {
  try {
    const patient = await ehrService.getPatient(req.params.id);
    res.json(ok(patient));
  } catch (e) {
    next(e);
  }
};

const createPatient: RequestHandler = async (req, res, next) => {
  try {
    const created = await ehrService.createPatient(req.body);
    res.status(201).json(ok(created));
  } catch (e) {
    next(e);
  }
};

const updatePatient: RequestHandler = async (req, res, next) => {
  try {
    const updated = await ehrService.updatePatient(req.params.id, req.body);
    res.json(ok(updated));
  } catch (e) {
    next(e);
  }
};

const getPatientFhir: RequestHandler = async (req, res, next) => {
  try {
    const resource = await ehrService.getPatientFhir(req.params.id);
    res.json(ok(resource));
  } catch (e) {
    next(e);
  }
};

export const ehrController = {
  listPatients,
  getPatient,
  createPatient,
  updatePatient,
  getPatientFhir
};
