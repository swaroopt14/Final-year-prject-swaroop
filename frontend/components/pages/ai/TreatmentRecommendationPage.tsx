"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { mockPatients } from "@/lib/mockData";
import { useAlerts } from "@/lib/alerts-context";

function patientLabel(id: string) {
  const p = mockPatients.find((x) => x._id === id);
  return p ? `${p.firstName} ${p.lastName}` : id;
}

export function TreatmentRecommendationPage() {
  const alerts = useAlerts();
  const [patientId, setPatientId] = useState(mockPatients[0]?._id ?? "");
  const [constraints, setConstraints] = useState("Allergy: penicillin; CKD: adjust dosing.");
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
      policy: "Observe vs Admit",
      recommended: latestVitals?.spo2Pct < 92 || latestVitals?.temperatureC >= 39 ? "Admit + Sepsis screening" : "Observe + repeat vitals",
      steps: [
        "Repeat vitals in 15 minutes; ensure oxygen support if SpO₂ < 92%.",
        "Order labs: CBC, CMP, lactate; consider blood cultures if febrile.",
        "Review medications; run drug-interaction checker for new orders.",
        "Escalate to senior clinician for confirmation before initiating high-impact therapy."
      ],
      guardrails: ["Requires clinician confirmation", "Document evidence + rationale", "Avoid contraindications"],
      constraints
    });
    setRunning(false);
  }

  return (
    <Card>
      <CardHeader
        title="Treatment Recommendation (RL)"
        subtitle="Policy suggestions with guardrails + constraints (mock)"
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
            <div className="text-xs font-semibold text-slate-600">Constraints</div>
            <Textarea value={constraints} onChange={(e) => setConstraints(e.target.value)} className="min-h-[46px]" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={run} disabled={running}>
            {running ? "Computing…" : "Run Policy Engine"}
          </Button>
        </div>

        {out ? (
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Recommendation</div>
                <Badge tone="sky">{out.policy}</Badge>
              </div>
              <div className="mt-2 text-sm text-slate-700">
                <span className="font-semibold text-slate-900">{out.recommended}</span>
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-700">Suggested Steps</div>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {out.steps.map((s: string) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="text-sm font-semibold text-slate-900">Governance</div>
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-700">Guardrails</div>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {out.guardrails.map((g: string) => (
                    <li key={g}>• {g}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-700">Latest Vitals</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div>SpO₂: <span className="font-semibold">{latestVitals?.spo2Pct ?? "—"}</span></div>
                  <div>HR: <span className="font-semibold">{latestVitals?.heartRateBpm ?? "—"}</span></div>
                  <div>BP: <span className="font-semibold">{latestVitals?.systolicMmHg ?? "—"}/{latestVitals?.diastolicMmHg ?? "—"}</span></div>
                  <div>Temp: <span className="font-semibold">{latestVitals?.temperatureC ?? "—"}</span></div>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">Mock policy engine; replace with backend RL outputs.</div>
            </div>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

