"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { mockPatients } from "@/lib/mockData";
import { useAlerts } from "@/lib/alerts-context";

function patientLabel(id: string) {
  const p = mockPatients.find((x) => x._id === id);
  return p ? `${p.firstName} ${p.lastName} (${p.mrn})` : id;
}

export function AiDiagnosisPage() {
  const alerts = useAlerts();
  const [patientId, setPatientId] = useState(mockPatients[0]?._id ?? "");
  const [question, setQuestion] = useState("Summarize deterioration risk and suggest differential considerations.");
  const [notes, setNotes] = useState("Fever, tachycardia, low SpO₂. Rule out sepsis, pneumonia. Consider labs and cultures.");
  const [running, setRunning] = useState(false);
  const [out, setOut] = useState<any>(null);

  const latestVitals = useMemo(() => {
    for (const it of alerts.items) {
      if (it.type !== "vitals.stream") continue;
      const p: any = it.payload;
      if (p?.patientId === patientId) return p;
    }
    return null;
  }, [alerts.items, patientId]);

  async function run() {
    setRunning(true);
    setOut(null);
    await new Promise((r) => setTimeout(r, 650));
    setOut({
      summary:
        "Patient shows signs consistent with possible infection-related deterioration. Recommend focused assessment and labs. This is an AI support summary, not a diagnosis.",
      differentials: ["Sepsis (screen)", "Pneumonia", "Pulmonary embolism (rule out)", "Drug-induced fever"],
      missingData: ["Lactate", "WBC/CRP", "Blood cultures", "Chest imaging"],
      evidence: [
        { source: "Hospital SOP (Sepsis pathway)", snippet: "If SpO₂ < 92% with fever, escalate for sepsis screening and oxygen support." },
        { source: "Guideline (mock)", snippet: "Assess qSOFA/NEWS2 and obtain cultures prior to antibiotics when feasible." }
      ],
      vitals: latestVitals,
      query: question,
      note: notes
    });
    setRunning(false);
  }

  return (
    <Card>
      <CardHeader
        title="AI Diagnosis Assistant"
        subtitle="Explainable clinical reasoning with evidence + missing-data prompts (mock)"
        right={<Badge tone={alerts.connected ? "green" : "yellow"}>{alerts.connected ? "Live" : "Simulated"}</Badge>}
      />
      <CardBody className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">Patient</div>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-sky-200"
            >
              {mockPatients.map((p) => (
                <option key={p._id} value={p._id}>
                  {patientLabel(p._id)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">Query</div>
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <div className="text-xs font-semibold text-slate-600">Clinical Notes</div>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[110px]" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={run} disabled={running}>
            {running ? "Running…" : "Run Assistant"}
          </Button>
        </div>

        {out ? (
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="text-sm font-semibold text-slate-900">Summary</div>
              <div className="mt-2 text-sm text-slate-700">{out.summary}</div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-semibold text-slate-700">Differentials</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {out.differentials.map((d: string) => (
                      <li key={d}>• {d}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-semibold text-slate-700">Missing Data</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {out.missingData.map((d: string) => (
                      <li key={d}>• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Evidence (RAG)</div>
                <Badge tone="sky">Citations</Badge>
              </div>
              <div className="mt-3 space-y-2">
                {out.evidence.map((e: any, idx: number) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-semibold text-slate-800">{e.source}</div>
                    <div className="mt-1 text-xs text-slate-600">{e.snippet}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-700">Latest Vitals</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div>SpO₂: <span className="font-semibold">{out.vitals?.spo2Pct ?? "—"}</span></div>
                  <div>HR: <span className="font-semibold">{out.vitals?.heartRateBpm ?? "—"}</span></div>
                  <div>BP: <span className="font-semibold">{out.vitals?.systolicMmHg ?? "—"}/{out.vitals?.diastolicMmHg ?? "—"}</span></div>
                  <div>Temp: <span className="font-semibold">{out.vitals?.temperatureC ?? "—"}</span></div>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">Mock output; connect to backend RAG + policy checks later.</div>
            </div>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

