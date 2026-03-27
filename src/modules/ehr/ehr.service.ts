import { HttpError } from "../../utils/httpError.js";
import { PatientModel } from "./ehr.model.js";
import type { z } from "zod";
import { createPatientSchema, updatePatientSchema } from "./ehr.validation.js";
import { toFhirPatient } from "../../utils/fhir.mapper.js";
import { Types } from "mongoose";

type CreatePatientInput = z.infer<typeof createPatientSchema>;
type UpdatePatientInput = z.infer<typeof updatePatientSchema>;

async function createPatient(input: CreatePatientInput) {
  const existing = await PatientModel.findOne({ mrn: input.mrn }).lean().exec();
  if (existing) throw new HttpError(409, "MRN already exists", "MRN_EXISTS");

  const patient = await PatientModel.create({
    ...input
  });
  return patient.toObject();
}

async function listPatients() {
  return PatientModel.find({}).sort({ createdAt: -1 }).lean().exec();
}

async function getPatient(id: string) {
  if (!Types.ObjectId.isValid(id)) throw new HttpError(400, "Invalid patientId", "VALIDATION_ERROR");
  const patient = await PatientModel.findById(id).lean().exec();
  if (!patient) throw new HttpError(404, "Patient not found", "NOT_FOUND");
  return patient;
}

async function updatePatient(id: string, patch: UpdatePatientInput) {
  if (!Types.ObjectId.isValid(id)) throw new HttpError(400, "Invalid patientId", "VALIDATION_ERROR");
  const updated = await PatientModel.findByIdAndUpdate(
    id,
    patch,
    { new: true }
  )
    .lean()
    .exec();

  if (!updated) throw new HttpError(404, "Patient not found", "NOT_FOUND");
  return updated;
}

async function getPatientFhir(id: string) {
  if (!Types.ObjectId.isValid(id)) throw new HttpError(400, "Invalid patientId", "VALIDATION_ERROR");
  const patient = await PatientModel.findById(id).lean().exec();
  if (!patient) throw new HttpError(404, "Patient not found", "NOT_FOUND");
  return toFhirPatient(patient);
}

export const ehrService = {
  createPatient,
  listPatients,
  getPatient,
  updatePatient,
  getPatientFhir
};
