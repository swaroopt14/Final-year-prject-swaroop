"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import clsx from "clsx";
import { mockPatients } from "@/lib/mockData";
import { useAlerts } from "@/lib/alerts-context";
import { Sparkline } from "@/components/charts/Sparkline";

type LatestVitals = {
  patientId: string;
  at: number;
  heartRateBpm?: number;
  systolicMmHg?: number;
  diastolicMmHg?: number;
  spo2Pct?: number;
  temperatureC?: number;
};

function nameFor(id: string) {
  const p = mockPatients.find((x) => x._id === id);
  return p ? `${p.firstName} ${p.lastName}` : id;
}

function ageFor(id: string) {
  const p = mockPatients.find((x) => x._id === id);
  if (!p) return 0;
  const dob = new Date(p.dateOfBirth).getTime();
  return Math.floor((Date.now() - dob) / 31_557_600_000);
}

function comorbidityCount(id: string) {
  const p = mockPatients.find((x) => x._id === id);
  return Array.isArray(p?.comorbidities) ? p!.comorbidities!.length : 0;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeRisk(v: LatestVitals) {
  const spo2 = v.spo2Pct ?? 96;
  const hr = v.heartRateBpm ?? 80;
  const sys = v.systolicMmHg ?? 120;
  const temp = v.temperatureC ?? 36.9;
  const age = ageFor(v.patientId);
  const com = comorbidityCount(v.patientId);

  const spo2Risk = clamp((95 - spo2) / 10, 0, 1);
  const hrRisk = clamp((hr - 90) / 60, 0, 1);
  const sysRisk = clamp((110 - sys) / 50, 0, 1);
  const tempRisk = clamp((temp - 37.2) / 2.5, 0, 1);
  const baseRisk = clamp(age / 120, 0, 0.6) + clamp(com / 8, 0, 0.5);

  const score = clamp(0.42 * spo2Risk + 0.22 * hrRisk + 0.18 * sysRisk + 0.18 * tempRisk + 0.15 * baseRisk, 0, 1);
  return Math.round(score * 100) / 100;
}

function riskTone(score: number) {
  if (score >= 0.8) return "red" as const;
  if (score >= 0.5) return "yellow" as const;
  return "green" as const;
}

function bandLabel(score: number) {
  if (score >= 0.8) return "HIGH";
  if (score >= 0.5) return "MED";
  return "LOW";
}

function pickLatestVitals(items: { type: string; at: number; payload: unknown }[]) {
  const map = new Map<string, LatestVitals>();
  for (const it of items) {
    if (it.type !== "vitals.stream") continue;
    const p: any = it.payload;
    const pid = p?.patientId;
    if (!pid || map.has(pid)) continue;
    map.set(pid, { patientId: pid, at: it.at, ...p });
  }
  return map;
}

function trend(items: { type: string; at: number; payload: unknown }[], patientId: string, key: string) {
  const vals: number[] = [];
  for (const it of items) {
    if (it.type !== "vitals.stream") continue;
    const p: any = it.payload;
    if (p?.patientId !== patientId) continue;
    const v = Number(p?.[key]);
    if (!Number.isFinite(v)) continue;
    vals.push(v);
    if (vals.length >= 16) break;
  }
  return vals.reverse();
}

export function RiskTrendsPanel() {
  const alerts = useAlerts();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "med" | "low">("all");

  const latestMap = useMemo(() => pickLatestVitals(alerts.items), [alerts.items]);

  const rows = useMemo(() => {
    const norm = q.trim().toLowerCase();
    const ids = mockPatients.map((p) => p._id);
    return ids
      .map((id) => {
        const v = latestMap.get(id) ?? { patientId: id, at: 0 };
        const score = computeRisk(v);
        return { id, v, score };
      })
      .filter((r) => {
        if (filter === "high" && r.score < 0.8) return false;
        if (filter === "med" && (r.score < 0.5 || r.score >= 0.8)) return false;
        if (filter === "low" && r.score >= 0.5) return false;
        if (!norm) return true;
        const p = mockPatients.find((x) => x._id === r.id);
        const hay = `${nameFor(r.id)} ${p?.mrn ?? ""}`.toLowerCase();
        return hay.includes(norm);
      })
      .sort((a, b) => b.score - a.score);
  }, [q, filter, latestMap]);

  const kpis = useMemo(() => {
    const high = rows.filter((r) => r.score >= 0.8).length;
    const med = rows.filter((r) => r.score >= 0.5 && r.score < 0.8).length;
    const low = rows.filter((r) => r.score < 0.5).length;
    return { high, med, low };
  }, [rows]);

  return (
    <Card>
      <CardHeader
        title="Risk Score Trends"
        subtitle="All patients risk overview with vitals monitoring (demo risk model)"
        right={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge tone={alerts.connected ? "green" : "yellow"}>{alerts.connected ? "Live" : "Simulated"}</Badge>
            <Badge tone="red">High: {kpis.high}</Badge>
            <Badge tone="yellow">Med: {kpis.med}</Badge>
            <Badge tone="green">Low: {kpis.low}</Badge>
          </div>
        }
      />
      <CardBody className="space-y-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-[420px]">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patient (name / MRN)…" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "high", "med", "low"] as const).map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setFilter(x)}
                className={clsx(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  filter === x ? "border-sky-200 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                {x.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <div className="col-span-4">Patient</div>
              <div className="col-span-2">MRN</div>
              <div className="col-span-2">Risk</div>
              <div className="col-span-2">SpO₂</div>
              <div className="col-span-2">HR</div>
            </div>
            <div className="divide-y divide-slate-200">
              {rows.map((r) => {
                const p = mockPatients.find((x) => x._id === r.id);
                const v = r.v;
                return (
                  <div key={r.id} className="grid grid-cols-12 items-center gap-3 px-4 py-3">
                    <div className="col-span-4 min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{nameFor(r.id)}</div>
                      <div className="mt-0.5 truncate text-[11px] text-slate-500">
                        Age {ageFor(r.id)} • {Array.isArray(p?.comorbidities) && p!.comorbidities!.length ? p!.comorbidities!.join(", ") : "No comorbidities"}
                      </div>
                    </div>
                    <div className="col-span-2 text-sm text-slate-700">{p?.mrn ?? "—"}</div>
                    <div className="col-span-2">
                      <Badge tone={riskTone(r.score)}>
                        {bandLabel(r.score)} {r.score.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-sm text-slate-700">{typeof v.spo2Pct === "number" ? `${v.spo2Pct}%` : "—"}</div>
                    <div className="col-span-2 text-sm text-slate-700">{typeof v.heartRateBpm === "number" ? `${v.heartRateBpm}` : "—"}</div>
                  </div>
                );
              })}
              {rows.length === 0 ? <div className="px-4 py-10 text-sm text-slate-600">No patients match.</div> : null}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="text-sm font-semibold text-slate-900">Top Risk Patients</div>
              <div className="mt-1 text-xs text-slate-500">Per-patient trends (last 16 points).</div>
              <div className="mt-4 grid gap-3">
                {rows.slice(0, 3).map((r) => (
                  <div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-900">{nameFor(r.id)}</div>
                      <Badge tone={riskTone(r.score)}>{r.score.toFixed(2)}</Badge>
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>SpO₂</span>
                          <span className="font-semibold text-slate-700">%</span>
                        </div>
                        <div className="mt-1 h-[46px]">
                          <Sparkline values={trend(alerts.items, r.id, "spo2Pct").length ? trend(alerts.items, r.id, "spo2Pct") : [96, 95, 96, 97, 96, 95]} stroke="#10b981" fill="rgba(16,185,129,0.10)" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Heart Rate</span>
                          <span className="font-semibold text-slate-700">bpm</span>
                        </div>
                        <div className="mt-1 h-[46px]">
                          <Sparkline values={trend(alerts.items, r.id, "heartRateBpm").length ? trend(alerts.items, r.id, "heartRateBpm") : [80, 86, 90, 88, 94, 96]} stroke="#0284c7" fill="rgba(2,132,199,0.10)" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Temp</span>
                          <span className="font-semibold text-slate-700">°C</span>
                        </div>
                        <div className="mt-1 h-[46px]">
                          <Sparkline values={trend(alerts.items, r.id, "temperatureC").length ? trend(alerts.items, r.id, "temperatureC") : [36.8, 36.9, 37.2, 37.0, 37.4]} stroke="#f59e0b" fill="rgba(245,158,11,0.10)" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>BP (sys)</span>
                          <span className="font-semibold text-slate-700">mmHg</span>
                        </div>
                        <div className="mt-1 h-[46px]">
                          <Sparkline values={trend(alerts.items, r.id, "systolicMmHg").length ? trend(alerts.items, r.id, "systolicMmHg") : [118, 116, 114, 120, 110]} stroke="#64748b" fill="rgba(100,116,139,0.10)" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500">Replace heuristic risk with real ML risk series when available.</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              Next: add XAI attribution (SHAP) and evidence trace for each score and alert transition.
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

