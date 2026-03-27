"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import { mockVitalsByPatient, mockLabsByPatient } from "@/lib/mockData";

type Patient = {
  _id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  comorbidities?: string[];
};

type Vital = {
  recordedAt: string;
  heartRateBpm: number;
  systolicMmHg: number;
  diastolicMmHg: number;
  spo2Pct: number;
  temperatureC: number;
};

type LabReport = {
  reportedAt: string;
  reportType: string;
  summary: string;
  values: Record<string, number>;
};

function calcAge(dateOfBirth: string) {
  const dob = new Date(dateOfBirth).getTime();
  if (Number.isNaN(dob)) return 0;
  return Math.floor((Date.now() - dob) / 31_557_600_000);
}

function formatName(p: Patient) {
  return `${p.firstName} ${p.lastName}`;
}

function toneForSpo2(v?: Vital) {
  if (!v) return "slate" as const;
  if (v.spo2Pct < 92) return "red" as const;
  if (v.spo2Pct < 95) return "yellow" as const;
  return "green" as const;
}

function toneForTemp(v?: Vital) {
  if (!v) return "slate" as const;
  if (v.temperatureC >= 39) return "red" as const;
  if (v.temperatureC >= 38) return "yellow" as const;
  return "green" as const;
}

function toneForHr(v?: Vital) {
  if (!v) return "slate" as const;
  if (v.heartRateBpm >= 120) return "red" as const;
  if (v.heartRateBpm >= 100) return "yellow" as const;
  return "green" as const;
}

function MiniSeries({
  values,
  bands
}: {
  values: number[];
  bands?: Array<{ fromPct: number; toPct: number; className: string }>;
}) {
  const w = 240;
  const h = 64;
  const pad = 6;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const denom = Math.max(1e-9, max - min);
  const pts = values.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1);
    const y = h - pad - ((v - min) / denom) * (h - pad * 2);
    return [x, y] as const;
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <div className="relative">
      {bands?.map((b, idx) => (
        <div
          key={idx}
          className={clsx("absolute left-0 right-0", b.className)}
          style={{ top: `${b.fromPct}%`, height: `${b.toPct - b.fromPct}%` }}
          aria-hidden
        />
      ))}
      <svg width={w} height={h} className="relative block">
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-600" />
      </svg>
    </div>
  );
}

export function PatientDrawer({
  open,
  token,
  patient,
  onClose
}: {
  open: boolean;
  token: string;
  patient: Patient | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [labs, setLabs] = useState<LabReport[]>([]);

  useEffect(() => {
    if (!open || !patient) return;
    let cancelled = false;
    setLoading(true);
    if (!token) {
      const v = (mockVitalsByPatient[patient._id] ?? []) as unknown as Vital[];
      const l = (mockLabsByPatient[patient._id] ?? []) as unknown as LabReport[];
      setVitals(v);
      setLabs(l);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    api.setToken(token);
    Promise.all([
      api
        .get<{ data: Vital[] }>(`/api/vitals/records?patientId=${encodeURIComponent(patient._id)}`)
        .then((r) => r.data ?? [])
        .catch(() => (mockVitalsByPatient[patient._id] ?? []) as unknown as Vital[]),
      api
        .get<{ data: LabReport[] }>(`/api/lab/reports?patientId=${encodeURIComponent(patient._id)}`)
        .then((r) => r.data ?? [])
        .catch(() => (mockLabsByPatient[patient._id] ?? []) as unknown as LabReport[])
    ])
      .then(([v, l]) => {
        if (cancelled) return;
        setVitals(v);
        setLabs(l);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, patient?._id, token]);

  const latest = vitals[0];

  const spo2Series = useMemo(() => vitals.slice(0, 12).map((x) => x.spo2Pct).reverse(), [vitals]);
  const hrSeries = useMemo(() => vitals.slice(0, 12).map((x) => x.heartRateBpm).reverse(), [vitals]);

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px] transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={clsx(
          "fixed right-0 top-0 z-50 h-full w-full max-w-[520px] border-l border-slate-200 bg-white shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Patient details"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-slate-900">{patient ? formatName(patient) : "—"}</div>
              <div className="mt-0.5 flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span>MRN: {patient?.mrn || "—"}</span>
                <span>•</span>
                <span>Age: {patient ? calcAge(patient.dateOfBirth) : "—"}</span>
                <span>•</span>
                <span>Sex: {patient?.sex || "—"}</span>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid gap-3">
              <Card className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Latest Vitals</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {latest ? new Date(latest.recordedAt).toLocaleString() : "No vitals yet"}
                    </div>
                  </div>
                  <Badge tone={loading ? "yellow" : "slate"}>{loading ? "Loading…" : "Updated"}</Badge>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[11px] font-semibold text-slate-500">SpO₂</div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-lg font-semibold text-slate-900">{latest ? `${latest.spo2Pct}%` : "—"}</div>
                      <Badge tone={toneForSpo2(latest)}>{latest ? (latest.spo2Pct < 92 ? "LOW" : "OK") : "—"}</Badge>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[11px] font-semibold text-slate-500">Heart Rate</div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-lg font-semibold text-slate-900">{latest ? `${latest.heartRateBpm} bpm` : "—"}</div>
                      <Badge tone={toneForHr(latest)}>{latest ? (latest.heartRateBpm >= 120 ? "HIGH" : "OK") : "—"}</Badge>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[11px] font-semibold text-slate-500">Temp</div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-lg font-semibold text-slate-900">{latest ? `${latest.temperatureC}°C` : "—"}</div>
                      <Badge tone={toneForTemp(latest)}>{latest ? (latest.temperatureC >= 38 ? "FEVER" : "OK") : "—"}</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">SpO₂ Trend</div>
                    <Badge tone="slate">{spo2Series.length || 0} pts</Badge>
                  </div>
                  <div className="mt-3 text-slate-900">
                    <MiniSeries
                      values={spo2Series.length ? spo2Series : [96, 95, 96, 97, 96, 95, 96, 97, 96, 96]}
                      bands={[
                        { fromPct: 0, toPct: 33, className: "bg-emerald-50" },
                        { fromPct: 33, toPct: 66, className: "bg-amber-50" },
                        { fromPct: 66, toPct: 100, className: "bg-rose-50" }
                      ]}
                    />
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">Green/yellow/red bands indicate normal/alert zones (demo).</div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">HR Trend</div>
                    <Badge tone="slate">{hrSeries.length || 0} pts</Badge>
                  </div>
                  <div className="mt-3 text-slate-900">
                    <MiniSeries
                      values={hrSeries.length ? hrSeries : [72, 75, 74, 78, 80, 78, 79, 77, 78, 81]}
                      bands={[
                        { fromPct: 0, toPct: 33, className: "bg-emerald-50" },
                        { fromPct: 33, toPct: 66, className: "bg-amber-50" },
                        { fromPct: 66, toPct: 100, className: "bg-rose-50" }
                      ]}
                    />
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">Hook bands to clinical thresholds per metric later.</div>
                </Card>
              </div>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">Labs & Reports</div>
                  <Badge tone="slate">{labs.length} reports</Badge>
                </div>
                <div className="mt-3 space-y-2">
                  {labs.slice(0, 4).map((r, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-800">{r.reportType}</div>
                        <div className="text-[11px] text-slate-500">{new Date(r.reportedAt).toLocaleDateString()}</div>
                      </div>
                      <div className="mt-1 text-xs text-slate-600 line-clamp-2">{r.summary}</div>
                    </div>
                  ))}
                  {labs.length === 0 ? <div className="text-sm text-slate-600">No lab reports yet.</div> : null}
                </div>
              </Card>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Next: add “Explainable AI bundle” here (risk score, evidence, attributions, and audit trail per evaluation).
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
