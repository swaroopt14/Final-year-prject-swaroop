"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function MiniBar({ value, tone }: { value: number; tone: "sky" | "green" | "yellow" | "red" }) {
  const tones = {
    sky: "bg-sky-500",
    green: "bg-emerald-500",
    yellow: "bg-amber-500",
    red: "bg-rose-500"
  } as const;
  return (
    <div className="h-2 w-full rounded-full bg-slate-100">
      <div className={"h-2 rounded-full " + tones[tone]} style={{ width: `${Math.max(4, Math.min(100, value))}%` }} />
    </div>
  );
}

export function ClinicalIntelligencePanel({ roleLabel }: { roleLabel: string }) {
  return (
    <Card>
      <CardHeader
        title="Clinical Intelligence (Explainable)"
        subtitle="RAG + ML/NLP/RL signals packaged as an audit-ready recommendation bundle"
        right={<Badge tone="sky">{roleLabel}</Badge>}
      />
      <CardBody className="space-y-4">
        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-slate-700">
          Design principle: every AI output must include <span className="font-semibold">evidence</span>,{" "}
          <span className="font-semibold">uncertainty</span>, and <span className="font-semibold">audit metadata</span>.
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">Risk Score (ML)</div>
            <div className="mt-2 grid gap-2 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-700">Deterioration probability</span>
                <Badge tone="yellow">0.62</Badge>
              </div>
              <MiniBar value={62} tone="yellow" />
              <div className="mt-2 text-[11px] text-slate-500">Explainability: show SHAP/LIME attributions on the right.</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">Top Attributions (XAI)</div>
            <div className="mt-2 space-y-2 text-xs text-slate-600">
              <div>
                <div className="flex items-center justify-between">
                  <span>SpO₂ low</span>
                  <span className="font-semibold text-slate-700">+0.18</span>
                </div>
                <MiniBar value={72} tone="red" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span>Heart rate elevated</span>
                  <span className="font-semibold text-slate-700">+0.11</span>
                </div>
                <MiniBar value={54} tone="yellow" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span>Comorbidities count</span>
                  <span className="font-semibold text-slate-700">+0.07</span>
                </div>
                <MiniBar value={36} tone="sky" />
              </div>
              <div className="pt-1 text-[11px] text-slate-500">
                (Mock view) Hook this to backend XAI bundle once exposed.
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">RAG Evidence (Guidelines + Local Protocols)</div>
              <div className="mt-1 text-xs text-slate-500">Store doc ids + snippets + timestamps; require citations for recommendations.</div>
            </div>
            <div className="flex gap-2">
              <Badge tone="sky">Guidelines</Badge>
              <Badge tone="slate">Hospital SOP</Badge>
              <Badge tone="green">Patient Context</Badge>
            </div>
          </div>
          <div className="mt-3 grid gap-2 text-xs text-slate-700 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-800">Evidence #1</div>
              <div className="mt-1 text-slate-600">Protocol snippet placeholder (vector-retrieved).</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-800">Evidence #2</div>
              <div className="mt-1 text-slate-600">Guideline snippet placeholder (vector-retrieved).</div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

