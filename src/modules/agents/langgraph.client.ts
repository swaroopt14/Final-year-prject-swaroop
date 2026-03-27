import axios from "axios";
import { env } from "../../config/env.config.js";

export type LangGraphWorkflowRequest = {
  patientId: string;
  riskScore?: number;
  vitals?: Record<string, unknown>;
  drugs?: string[];
  noteText?: string;
};

export type LangGraphWorkflowResponse = {
  patientId: string;
  riskScore: number;
  recommendedAction: string;
  interactions: Array<Record<string, unknown>>;
  llmSummary: string;
  audit: Array<Record<string, unknown>>;
};

export async function runLangGraphWorkflow(req: LangGraphWorkflowRequest): Promise<LangGraphWorkflowResponse> {
  const url = `${env.AGENT_SERVICE_BASE_URL}/workflow/run`;
  const res = await axios.post(url, req, { timeout: 20_000 });
  return res.data as LangGraphWorkflowResponse;
}

