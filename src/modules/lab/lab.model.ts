import { Schema, model, Types } from "mongoose";

export type LabReport = {
  patientId: Types.ObjectId;
  reportType: string;
  reportedAt: Date;
  summary: string;
  values: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
};

const labReportSchema = new Schema<LabReport>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    reportType: { type: String, required: true },
    reportedAt: { type: Date, required: true, index: true },
    summary: { type: String, required: true },
    values: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

export const LabReportModel = model<LabReport>("LabReport", labReportSchema);

