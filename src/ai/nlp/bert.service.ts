import axios from "axios";
import { env } from "../../config/env.config.js";

export type BertClinicalParse = {
  entities?: Array<{ text: string; label: string; score?: number }>;
  summary?: string;
};

export async function parseClinicalNote(noteText: string): Promise<BertClinicalParse> {
  try {
    const res = await axios.post(`${env.ML_SERVICE_BASE_URL}/analyze/notes`, { text: noteText }, { timeout: 15_000 });
    return res.data as BertClinicalParse;
  } catch {
    // Backward compatibility with dedicated BERT inference endpoint.
    const res = await axios.post(env.BERT_INFERENCE_URL, { text: noteText }, { timeout: 15_000 });
    return res.data as BertClinicalParse;
  }
}
