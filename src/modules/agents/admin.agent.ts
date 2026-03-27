import { Types } from "mongoose";
import { WorkflowLogModel } from "./workflowlog.model.js";

type DecisionLogDoc = {
  _id: unknown;
  at: Date;
  [key: string]: unknown;
};

type DecisionCursor = {
  at: string;
  id: string;
};

function encodeDecisionCursor(input: DecisionCursor) {
  return Buffer.from(JSON.stringify(input), "utf8").toString("base64url");
}

function decodeDecisionCursor(cursor: string): DecisionCursor {
  const raw = Buffer.from(cursor, "base64url").toString("utf8");
  const parsed = JSON.parse(raw) as DecisionCursor;
  if (!parsed?.at || !parsed?.id) throw new Error("invalid cursor payload");
  return parsed;
}

export class AdminAgent {
  async log(entry: { agent: string; topic: string; payload: unknown }) {
    await WorkflowLogModel.create({
      agent: entry.agent,
      topic: entry.topic,
      payload: entry.payload,
      at: new Date()
    });
  }

  async listClinicalDecisions(params?: {
    patientId?: string;
    from?: Date;
    to?: Date;
    limit?: number;
    cursor?: string;
  }) {
    const query: Record<string, unknown> = {
      topic: "agents.clinical_decision"
    };

    if (params?.patientId) query["payload.patientId"] = params.patientId;
    if (params?.from || params?.to) {
      query.at = {
        ...(params.from ? { $gte: params.from } : {}),
        ...(params.to ? { $lte: params.to } : {})
      };
    }

    const limit = Math.max(1, Math.min(100, params?.limit ?? 20));
    const andClauses: Array<Record<string, unknown>> = [query];

    if (params?.cursor) {
      const decoded = decodeDecisionCursor(params.cursor);
      const cursorDate = new Date(decoded.at);
      if (Number.isNaN(cursorDate.getTime())) throw new Error("invalid cursor timestamp");
      const cursorId = new Types.ObjectId(decoded.id);

      andClauses.push({
        $or: [
          { at: { $lt: cursorDate } },
          { at: cursorDate, _id: { $lt: cursorId } }
        ]
      });
    }

    const dbQuery = andClauses.length === 1 ? andClauses[0]! : { $and: andClauses };
    const rows = (await WorkflowLogModel.find(dbQuery)
      .sort({ at: -1, _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec()) as DecisionLogDoc[];

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const tail = items[items.length - 1];
    const nextCursor = hasMore && tail
      ? encodeDecisionCursor({
          at: new Date(tail.at).toISOString(),
          id: String(tail._id)
        })
      : null;

    return { items, nextCursor };
  }
}
