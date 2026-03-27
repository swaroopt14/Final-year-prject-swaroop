import { Types } from "mongoose";
import { eventBus } from "../../events/index.js";
import { Topics } from "../../events/topics.js";
import { HttpError } from "../../utils/httpError.js";
import { PatientModel } from "../ehr/ehr.model.js";
import { createVitalRecordSchema } from "./vitals.validation.js";
import type { z } from "zod";
import { VitalRecordModel } from "./vitals.model.js";

type CreateVitalInput = z.infer<typeof createVitalRecordSchema>;

async function createRecord(input: CreateVitalInput) {
  if (!Types.ObjectId.isValid(input.patientId)) throw new HttpError(400, "Invalid patientId", "VALIDATION_ERROR");

  const patient = await PatientModel.findById(input.patientId).lean().exec();
  if (!patient) throw new HttpError(404, "Patient not found", "NOT_FOUND");

  const record = await VitalRecordModel.create({
    patientId: new Types.ObjectId(input.patientId),
    recordedAt: input.recordedAt ? new Date(input.recordedAt) : new Date(),
    heartRateBpm: input.heartRateBpm,
    systolicMmHg: input.systolicMmHg,
    diastolicMmHg: input.diastolicMmHg,
    spo2Pct: input.spo2Pct,
    temperatureC: input.temperatureC
  });

  const payload = {
    patientId: input.patientId,
    recordedAt: record.recordedAt.toISOString(),
    heartRateBpm: input.heartRateBpm,
    systolicMmHg: input.systolicMmHg,
    diastolicMmHg: input.diastolicMmHg,
    spo2Pct: input.spo2Pct,
    temperatureC: input.temperatureC
  };

  await eventBus.publish(Topics.vitalsStream, payload);
  return record.toObject();
}

async function listRecordsByPatient(patientId: string) {
  if (!Types.ObjectId.isValid(patientId)) throw new HttpError(400, "Invalid patientId", "VALIDATION_ERROR");
  return VitalRecordModel.find({ patientId: new Types.ObjectId(patientId) }).sort({ recordedAt: -1 }).lean().exec();
}

export const vitalsService = {
  createRecord,
  listRecordsByPatient
};

