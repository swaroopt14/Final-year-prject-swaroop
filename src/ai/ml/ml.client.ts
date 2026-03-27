import axios from "axios";
import { env } from "../../config/env.config.js";

export type RiskPrediction = {
  risk_score: number;
  model?: string;
};

export async function predictRisk(patient: Record<string, unknown>): Promise<RiskPrediction> {
  try {
    const res = await axios.post(`${env.ML_SERVICE_BASE_URL}/predict/risk`, { patient }, { timeout: 10_000 });
    return res.data?.prediction as RiskPrediction;
  } catch {
    // Backward compatibility with older ML service route.
    const res = await axios.post(`${env.ML_SERVICE_BASE_URL}/predict`, { patient }, { timeout: 10_000 });
    return res.data?.prediction as RiskPrediction;
  }
}
