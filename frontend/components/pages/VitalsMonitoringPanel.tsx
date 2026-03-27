"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAlerts } from "@/lib/alerts-context";
import { Input } from "@/components/ui/Input";
import clsx from "clsx";
import { mockPatients } from "@/lib/mockData";
import { Sparkline } from "@/components/charts/Sparkline";

function MiniBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-10 items-end gap-1">
      {values.map((v, i) => (
        <div
          key={i}
          className={clsx("w-2 rounded-t-sm", v / max > 0.66 ? "bg-rose-500" : v / max > 0.33 ? "bg-amber-500" : "bg-emerald-500")}
          style={{ height: `${Math.max(3, Math.round((v / max) * 40))}px` }}
          aria-hidden
        />
      ))}
    </div>
  );
}

function toneForVitals(v?: any) {
  if (!v) return "slate" as const;
  const spo2 = Number(v.spo2Pct);
  const hr = Number(v.heartRateBpm);
  const sys = Number(v.systolicMmHg);
  const temp = Number(v.temperatureC);
  if (spo2 < 92 || hr >= 130 || sys < 90 || temp >= 39) return "red" as const;
  if (spo2 < 95 || hr >= 110 || sys < 100 || temp >= 38) return "yellow" as const;
  return "green" as const;
}

function labelForPatientId(id: string) {
  const p = mockPatients.find((x) => x._id === id);
  return p ? `${p.firstName} ${p.lastName}` : id;
}

export function VitalsMonitoringPanel() {
  const alerts = useAlerts();
  const [q, setQ] = useState("");
  const [patientId, setPatientId] = useState<string>("all");

  const vitals = useMemo(() => {
    const items = alerts.items.filter((i) => i.type === "vitals.stream");
    const norm = q.trim().toLowerCase();
    const filtered = !norm
      ? items
      : items.filter((i) => JSON.stringify(i.payload).toLowerCase().includes(norm));
    const byPatient =
      patientId === "all"
        ? filtered
        : filtered.filter((i) => typeof i.payload === "object" && i.payload && (i.payload as any).patientId === patientId);
    return byPatient.slice(0, 120);
  }, [alerts.items, q]);

  const kpis = useMemo(() => {
    const high = alerts.items.filter((i) => i.type === "high_risk_alert").length;
    const drug = alerts.items.filter((i) => i.type === "drug_alert").length;
    const v = alerts.items.filter((i) => i.type === "vitals.stream").length;
    return { high, drug, v };
  }, [alerts.items]);

  const latestByPatient = useMemo(() => {
    const map = new Map<string, any>();
    for (const it of alerts.items) {
      if (it.type !== "vitals.stream") continue;
      const payload: any = it.payload;
      const pid = payload?.patientId;
      if (!pid || map.has(pid)) continue;
      map.set(pid, { at: it.at, ...payload });
    }
    return map;
  }, [alerts.items]);

  const patientOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts: Array<{ id: string; label: string }> = [];
    for (const [id] of latestByPatient) {
      if (seen.has(id)) continue;
      seen.add(id);
      opts.push({ id, label: labelForPatientId(id) });
    }
    opts.sort((a, b) => a.label.localeCompare(b.label));
    return opts;
  }, [latestByPatient]);

  const trendFor = useMemo(() => {
    const items = alerts.items.filter((i) => i.type === "vitals.stream");
    return (pid: string, key: string) => {
      const vals: number[] = [];
      for (const it of items) {
        const p: any = it.payload;
        if (p?.patientId !== pid) continue;
        const v = Number(p?.[key]);
        if (!Number.isFinite(v)) continue;
        vals.push(v);
        if (vals.length >= 14) break;
      }
      return vals.reverse();
    };
  }, [alerts.items]);

  return (
    <Card>
      <CardHeader
        title="Live Monitoring"
        subtitle="Real-time vitals stream + quick anomaly surfacing (SSE demo)"
        right={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge tone={alerts.connected ? "green" : "red"}>{alerts.connected ? "Stream Live" : "Stream Offline"}</Badge>
            <Badge tone="red">High-Risk: {kpis.high}</Badge>
            <Badge tone="yellow">Drug: {kpis.drug}</Badge>
            <Badge tone="sky">Vitals: {kpis.v}</Badge>
          </div>
        }
      />
      <CardBody className="space-y-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-[420px]">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search in stream payload (patientId, vitals…)" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPatientId("all")}
              className={clsx(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                patientId === "all" ? "border-sky-200 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              All Patients
            </button>
            {patientOptions.slice(0, 6).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPatientId(p.id)}
                className={clsx(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  patientId === p.id ? "border-sky-200 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
                title={p.label}
              >
                {p.label.split(" ")[0]}
              </button>
            ))}
            <span className="text-[11px] text-slate-500">
              {alerts.connected ? "Streaming" : "Simulated"} • {patientId === "all" ? "All" : "Selected"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Patient Feed</div>
              <Badge tone="slate">{latestByPatient.size} active</Badge>
            </div>
            <div className="mt-3 space-y-2">
              {patientOptions.length === 0 ? (
                <div className="text-sm text-slate-600">Waiting for vitals events…</div>
              ) : (
                patientOptions.map((p) => {
                  const v = latestByPatient.get(p.id);
                  const tone = toneForVitals(v);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPatientId(p.id)}
                      className={clsx(
                        "w-full rounded-2xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-200",
                        patientId === p.id ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900">{p.label}</div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            Last: {v?.at ? new Date(v.at).toLocaleTimeString() : "—"}
                          </div>
                        </div>
                        <Badge tone={tone}>{tone === "red" ? "CRITICAL" : tone === "yellow" ? "WATCH" : "OK"}</Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                        <div className="rounded-xl bg-slate-50 px-2 py-1">SpO₂: <span className="font-semibold text-slate-800">{v?.spo2Pct ?? "—"}</span></div>
                        <div className="rounded-xl bg-slate-50 px-2 py-1">HR: <span className="font-semibold text-slate-800">{v?.heartRateBpm ?? "—"}</span></div>
                        <div className="rounded-xl bg-slate-50 px-2 py-1">BP: <span className="font-semibold text-slate-800">{v?.systolicMmHg ?? "—"}/{v?.diastolicMmHg ?? "—"}</span></div>
                        <div className="rounded-xl bg-slate-50 px-2 py-1">Temp: <span className="font-semibold text-slate-800">{v?.temperatureC ?? "—"}</span></div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Trends</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {patientId === "all" ? "Select a patient to view trends." : labelForPatientId(patientId)}
                  </div>
                </div>
                <Badge tone="slate">Last 14 points</Badge>
              </div>

              {patientId === "all" ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  Choose a patient from the left to view HR/SpO₂/Temperature trends with quick risk highlighting.
                </div>
              ) : (
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-600">SpO₂</div>
                      <Badge tone="slate">%</Badge>
                    </div>
                    <div className="mt-2 h-[56px]">
                      <Sparkline values={trendFor(patientId, "spo2Pct").length ? trendFor(patientId, "spo2Pct") : [96, 95, 96, 97, 96, 95, 96, 97, 96, 96]} stroke="#10b981" fill="rgba(16,185,129,0.10)" />
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">Alert &lt; 92%</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-600">Heart Rate</div>
                      <Badge tone="slate">bpm</Badge>
                    </div>
                    <div className="mt-2 h-[56px]">
                      <Sparkline values={trendFor(patientId, "heartRateBpm").length ? trendFor(patientId, "heartRateBpm") : [72, 75, 74, 78, 80, 78, 79, 77, 78, 81]} stroke="#0284c7" fill="rgba(2,132,199,0.10)" />
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">Watch ≥ 110 • Critical ≥ 130</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-600">Temperature</div>
                      <Badge tone="slate">°C</Badge>
                    </div>
                    <div className="mt-2 h-[56px]">
                      <Sparkline values={trendFor(patientId, "temperatureC").length ? trendFor(patientId, "temperatureC") : [36.8, 36.9, 37.1, 37.2, 37.4, 37.1, 36.9]} stroke="#f59e0b" fill="rgba(245,158,11,0.10)" />
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">Fever ≥ 38 • High ≥ 39</div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Recent Vitals Events</div>
                <Badge tone="slate">{vitals.length} shown</Badge>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:col-span-1">
                  <div className="text-xs font-semibold text-slate-600">Stream Volume</div>
                  <div className="mt-2">
                    <MiniBars values={Array.from({ length: 18 }, (_, i) => (vitals.length * (i + 1)) % 27)} />
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">Demo throughput bars.</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 lg:col-span-2">
                  <div className="max-h-[260px] overflow-y-auto">
                    <div className="divide-y divide-slate-200">
                      {vitals.length === 0 ? (
                        <div className="px-3 py-8 text-sm text-slate-600">No vitals events yet.</div>
                      ) : (
                        vitals.slice(0, 60).map((it) => (
                          <div key={it.at} className="px-3 py-2">
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-semibold text-slate-800">
                                {labelForPatientId((it.payload as any)?.patientId ?? "—")}
                              </div>
                              <div className="text-[11px] text-slate-500">{new Date(it.at).toLocaleTimeString()}</div>
                            </div>
                            <div className="mt-1 truncate text-[12px] text-slate-700">{JSON.stringify(it.payload)}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
