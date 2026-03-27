import type { RequestHandler } from "express";
import { ok } from "../../utils/response.wrapper.js";
import { pharmacyService } from "./pharmacy.service.js";

const checkPrescription: RequestHandler = async (req, res, next) => {
  try {
    const result = await pharmacyService.checkPrescription(req.body);
    res.json(ok(result));
  } catch (e) {
    next(e);
  }
};

export const pharmacyController = {
  checkPrescription
};

