import { Schema, model } from "mongoose";

export type WorkflowLog = {
  at: Date;
  agent: string;
  topic: string;
  payload: unknown;
  createdAt: Date;
  updatedAt: Date;
};

const workflowLogSchema = new Schema<WorkflowLog>(
  {
    at: { type: Date, required: true, index: true },
    agent: { type: String, required: true, index: true },
    topic: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

export const WorkflowLogModel = model<WorkflowLog>("WorkflowLog", workflowLogSchema);

