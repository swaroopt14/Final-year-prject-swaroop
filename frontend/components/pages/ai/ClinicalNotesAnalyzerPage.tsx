"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function ClinicalNotesAnalyzerPage() {
  const [text, setText] = useState(
    "Chief complaint: fever and shortness of breath.\nMeds: warfarin, aspirin.\nAssessment: possible pneumonia; consider sepsis screening.\nPlan: labs + oxygen support."
  );
  const [running, setRunning] = useState(false);
  const [out, setOut] = useState<any>(null);

  async function run() {
    setRunning(true);
    setOut(null);
    await new Promise((r) => setTimeout(r, 550));
    setOut({
      entities: ["fever", "shortness of breath", "warfarin", "aspirin", "pneumonia", "sepsis"],
      flags: ["Potential drug interaction (warfarin + aspirin)", "Missing objective vitals in note"],
      summary: "Note suggests respiratory infection; recommends labs and oxygen support; consider sepsis screening."
    });
    setRunning(false);
  }

  return (
    <Card>
      <CardHeader
        title="Clinical Notes Analyzer (BERT)"
        subtitle="Entity extraction + flags + summary (mock)"
        right={<Badge tone="sky">NLP</Badge>}
      />
      <CardBody className="space-y-4">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-600">Clinical Note</div>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[180px]" />
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={run} disabled={running}>
            {running ? "Analyzing…" : "Analyze Note"}
          </Button>
        </div>

        {out ? (
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="text-sm font-semibold text-slate-900">Summary</div>
              <div className="mt-2 text-sm text-slate-700">{out.summary}</div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-700">Entities</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {out.entities.map((e: string) => (
                    <span key={e} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="text-sm font-semibold text-slate-900">Flags</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {out.flags.map((f: string) => (
                  <li key={f} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-[11px] text-slate-500">Replace with backend NLP output and link flags to actions.</div>
            </div>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

