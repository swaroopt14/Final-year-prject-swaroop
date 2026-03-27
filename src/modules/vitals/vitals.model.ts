import { Schema, model, Types } from "mongoose";

export type VitalRecord = {
  patientId: Types.ObjectId;
  recordedAt: Date;
  heartRateBpm: number;
  systolicMmHg: number;
  diastolicMmHg: number;
  spo2Pct: number;
  temperatureC: number;
  createdAt: Date;
  updatedAt: Date;
};

const vitalsSchema = new Schema<VitalRecord>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    recordedAt: { type: Date, required: true, index: true },
    heartRateBpm: { type: Number, required: true },
    systolicMmHg: { type: Number, required: true },
    diastolicMmHg: { type: Number, required: true },
    spo2Pct: { type: Number, required: true },
    temperatureC: { type: Number, required: true }
  },
  { timestamps: true }
);

export const VitalRecordModel = model<VitalRecord>("VitalRecord", vitalsSchema);

