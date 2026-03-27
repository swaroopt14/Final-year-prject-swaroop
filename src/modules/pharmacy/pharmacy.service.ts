import { Types } from "mongoose";
import { eventBus } from "../../events/index.js";
import { Topics } from "../../events/topics.js";
import { HttpError } from "../../utils/httpError.js";
import { PatientModel } from "../ehr/ehr.model.js";
import { findInteractions } from "./drug.rules.js";
import { checkPrescriptionSchema } from "./pharmacy.validation.js";
import type { z } from "zod";

type CheckPrescriptionInput = z.infer<typeof checkPrescriptionSchema>;

async function checkPrescription(input: CheckPrescriptionInput) {
  if (!Types.ObjectId.isValid(input.patientId)) throw new HttpError(400, "Invalid patientId", "VALIDATION_ERROR");

  const patient = await PatientModel.findById(input.patientId).lean().exec();
  if (!patient) throw new HttpError(404, "Patient not found", "NOT_FOUND");

  const interactions = findInteractions(input.drugs);
  await eventBus.publish(Topics.pharmacyOrderPlaced, {
    patientId: input.patientId,
    drugs: input.drugs,
    at: new Date().toISOString()
  });

  if (interactions.length) {
    await eventBus.publish(Topics.drugAlert, {
      patientId: input.patientId,
      interactions,
      at: new Date().toISOString()
    });
  }

  return { interactions, safe: interactions.length === 0 };
}

export const pharmacyService = {
  checkPrescription
};
