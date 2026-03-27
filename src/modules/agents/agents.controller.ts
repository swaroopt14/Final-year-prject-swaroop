import type { RequestHandler } from "express";
import axios from "axios";
import { ok } from "../../utils/response.wrapper.js";
import { orchestrator } from "./bootstrap.js";
import { env } from "../../config/env.config.js";
import { decisionsQuerySchema } from "./agents.validation.js";
import { HttpError } from "../../utils/httpError.js";
import { runClinicalDecisionCycle } from "./clinical.decision.js";

async function checkHealth(url: string, timeout = 2500) {
  try {
    const res = await axios.get(url, { timeout });
    return { status: "ok" as const, details: res.data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unreachable";
    return { status: "degraded" as const, error: msg };
  }
}

function deriveBertHealthUrl(inferUrl: string) {
  try {
    const u = new URL(inferUrl);
    u.pathname = "/health";
    u.search = "";
    return u.toString();
  } catch {
    return inferUrl.replace(/\/infer\/?$/, "/health");
  }
}

const doctorEvaluate: RequestHandler = async (req, res, next) => {
  try {
    const out = await runClinicalDecisionCycle({
      patientId: req.body.patientId,
      noteText: req.body.noteText,
      vitals: req.body.vitals,
      drugs: req.body.drugs
    });
    res.json(ok(out));
  } catch (e) {
    next(e);
  }
};

const health: RequestHandler = async (_req, res, _next) => {
  const ml = await checkHealth(`${env.ML_SERVICE_BASE_URL}/health`);
  const agentService = await checkHealth(`${env.AGENT_SERVICE_BASE_URL}/health`);
  const bert = await checkHealth(deriveBertHealthUrl(env.BERT_INFERENCE_URL));

  res.json(
    ok({
      services: {
        ml,
        agentService,
        bert
      }
    })
  );
};

const listClinicalDecisions: RequestHandler = async (req, res, next) => {
  try {
    const parsed = decisionsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new HttpError(400, "Validation error", "VALIDATION_ERROR", parsed.error.flatten());
    }

    const q = parsed.data;
    let decisions: { items: unknown[]; nextCursor: string | null };
    try {
      decisions = await orchestrator.listClinicalDecisions({
        patientId: q.patientId,
        from: q.from ? new Date(q.from) : undefined,
        to: q.to ? new Date(q.to) : undefined,
        cursor: q.cursor,
        limit: q.limit
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "invalid cursor";
      if (
        q.cursor ||
        msg.toLowerCase().includes("cursor") ||
        msg.toLowerCase().includes("base64") ||
        msg.toLowerCase().includes("objectid")
      ) {
        throw new HttpError(400, "Invalid cursor", "VALIDATION_ERROR");
      }
      throw err;
    }

    res.json(
      ok({
        items: decisions.items,
        count: decisions.items.length,
        filters: q,
        paging: {
          nextCursor: decisions.nextCursor
        }
      })
    );
  } catch (e) {
    next(e);
  }
};

export const agentsController = {
  doctorEvaluate,
  health,
  listClinicalDecisions
};
