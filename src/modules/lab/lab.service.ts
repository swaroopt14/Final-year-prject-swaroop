import { Types } from "mongoose";
import { HttpError } from "../../utils/httpError.js";
import { LabReportModel } from "./lab.model.js";
import { PatientModel } from "../ehr/ehr.model.js";
import { createLabReportSchema, ingestHl7Schema } from "./lab.validation.js";
import type { z } from "zod";
import { parseHl7 } from "../../utils/hl7.parser.js";
import { eventBus } from "../../events/index.js";
import { Topics } from "../../events/topics.js";

type CreateLabReportInput = z.infer<typeof createLabReportSchema>;
type IngestHl7Input = z.infer<typeof ingestHl7Schema>;

async function createReport(input: CreateLabReportInput) {
  if (!Types.ObjectId.isValid(input.patientId)) {
    throw new HttpError(400, "Invalid patientId", "VALIDATION_ERROR");
  }

  const patient = await PatientModel.findById(input.patientId).lean().exec();
  if (!patient) throw new HttpError(404, "Patient not found", "NOT_FOUND");

  const report = await LabReportModel.create({
    patientId: new Types.ObjectId(input.patientId),
    reportType: input.reportType,
    reportedAt: input.reportedAt ? new Date(input.reportedAt) : new Date(),
    summary: input.summary,
    values: input.values
  });

  const reportedAt =
    report.reportedAt instanceof Date
      ? report.reportedAt.toISOString()
      : input.reportedAt ?? new Date().toISOString();

  await eventBus.publish(Topics.labResultReceived, {
    patientId: input.patientId,
    reportType: input.reportType,
    reportedAt,
    values: input.values
  });

  return report.toObject();
}

async function listReportsByPatient(patientId: string) {
  if (!Types.ObjectId.isValid(patientId)) throw new HttpError(400, "Invalid patientId", "VALIDATION_ERROR");
  return LabReportModel.find({ patientId: new Types.ObjectId(patientId) }).sort({ reportedAt: -1 }).lean().exec();
}

function normalizeHl7Identifier(identifier: string) {
  return identifier.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase() || "unknown";
}

async function ingestHl7(input: IngestHl7Input) {
  const parsed = parseHl7(input.message);
  const pid = parsed.segments.find((s) => s.name === "PID");
  const mrn = (pid?.fields?.[3] ?? "").split("^")[0]?.trim();
  if (!mrn) {
    throw new HttpError(400, "HL7 PID segment missing MRN (PID-3)", "VALIDATION_ERROR");
  }

  const patient = await PatientModel.findOne({ mrn }).lean().exec();
  if (!patient) throw new HttpError(404, "Patient not found for MRN", "NOT_FOUND");

  const obx = parsed.segments.filter((s) => s.name === "OBX");
  const values: Record<string, number> = {};
  for (const segment of obx) {
    const rawCode = segment.fields[3] ?? "obx_value";
    const code = normalizeHl7Identifier(rawCode.split("^")[0] ?? rawCode);
    const val = Number(segment.fields[5]);
    if (Number.isFinite(val)) values[code] = val;
  }

  const nte = parsed.segments.find((s) => s.name === "NTE");
  const summary =
    (nte?.fields?.[3] ?? "").trim() || `HL7 ingestion for MRN ${mrn} (${Object.keys(values).length} numeric values)`;

  const report = await LabReportModel.create({
    patientId: patient._id,
    reportType: input.reportType,
    reportedAt: input.reportedAt ? new Date(input.reportedAt) : new Date(),
    summary,
    values
  });

  const reportedAt =
    report.reportedAt instanceof Date
      ? report.reportedAt.toISOString()
      : input.reportedAt ?? new Date().toISOString();

  await eventBus.publish(Topics.labResultReceived, {
    patientId: String(patient._id),
    reportType: input.reportType,
    reportedAt,
    values
  });

  return {
    report: report.toObject(),
    parsed
  };
}

export const labService = {
  createReport,
  listReportsByPatient,
  ingestHl7
};
