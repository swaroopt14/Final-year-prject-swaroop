"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkline } from "@/components/charts/Sparkline";
import { mockPatients } from "@/lib/mockData";
import { useAlerts } from "@/lib/alerts-context";

function patientLabel(id: string) {
  const p = mockPatients.find((x) => x._id === id);
  return p ? `${p.firstName} ${p.lastName}` : id;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function riskTone(score: number) {
  if (score >= 0.8) return "red" as const;
  if (score >= 0.5) return "yellow" as const;
  return "green" as const;
}

export function DiseasePredictionPage() {
  const alerts = useAlerts();
  const [patientId, setPatientId] = useState(mockPatients[0]?._id ?? "");
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0.42);

  const series = useMemo(() => {
    const vals: number[] = [];
    for (const it of alerts.items) {
      if (it.type !== "vitals.stream") continue;
      const p: any = it.payload;
      if (p?.patientId !== patientId) continue;
      const spo2 = Number(p?.spo2Pct ?? 96);
      const hr = Number(p?.heartRateBpm ?? 80);
      const temp = Number(p?.temperatureC ?? 36.9);
      const s = clamp(0.5 + (95 - spo2) / 25 + (hr - 90) / 220 + (temp - 37) / 7, 0, 1);
      vals.push(Math.round(s * 100) / 100);
      if (vals.length >= 18) break;
    }
    const out = vals.reverse();
    return out.length ? out : [0.18, 0.22, 0.25, 0.33, 0.42, 0.48, 0.52, 0.49, 0.56];
  }, [alerts.items, patientId]);

  async function run() {
    setRunning(true);
    await new Promise((r) => setTimeout(r, 550));
    const latest = series[series.length - 1] ?? 0.4;
    setScore(latest);
    setRunning(false);
  }

  return (
    <Card>
      <CardHeader
        title="Disease Prediction (ML)"
        subtitle="Risk score forecasting with explainable signals (mock)"
        right={<Badge tone={alerts.connected ? "green" : "yellow"}>{alerts.connected ? "Live" : "Simulated"}</Badge>}
      />
      <CardBody className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Patient</span>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-sky-200"
            >
              {mockPatients.map((p) => (
                <option key={p._id} value={p._id}>
                  {patientLabel(p._id)}
                </option>
              ))}
            </select>
          </div>
          <Button variant="primary" onClick={run} disabled={running}>
            {running ? "Scoring…" : "Run ML Prediction"}
          </Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Current Risk</div>
              <Badge tone={riskTone(score)}>{score.toFixed(2)}</Badge>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-600">Key Contributors (mock)</div>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between"><span>SpO₂</span><span className="font-semibold">+0.18</span></div>
                <div className="flex items-center justify-between"><span>Heart rate</span><span className="font-semibold">+0.11</span></div>
                <div className="flex items-center justify-between"><span>Temperature</span><span className="font-semibold">+0.07</span></div>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">Replace with SHAP/LIME attributions from backend.</div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Risk Trend</div>
              <Badge tone="slate">Last {series.length} points</Badge>
            </div>
            <div className="mt-4 h-[120px]">
              <Sparkline values={series} stroke="#0284c7" fill="rgba(2,132,199,0.10)" />
            </div>
            <div className="mt-2 text-[11px] text-slate-500">Overlay thresholds and alert annotations in production.</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

