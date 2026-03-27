"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Sparkline } from "@/components/charts/Sparkline";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";
import { useAlerts } from "@/lib/alerts-context";

function KpiCard({
  title,
  value,
  delta,
  tone = "default",
  right
}: {
  title: string;
  value: string;
  delta?: string;
  tone?: "default" | "accent";
  right?: React.ReactNode;
}) {
  const accent = tone === "accent";
  return (
    <div
      className={clsx(
        "rounded-2xl border p-4 shadow-soft",
        accent ? "border-emerald-200 bg-emerald-700 text-white" : "border-slate-200 bg-white"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={clsx("text-xs font-semibold", accent ? "text-emerald-50/90" : "text-slate-500")}>{title}</div>
          <div className={clsx("mt-2 text-3xl font-semibold", accent ? "text-white" : "text-slate-900")}>{value}</div>
        </div>
        {delta ? (
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold",
              accent ? "bg-white/15 text-white" : "bg-emerald-100 text-emerald-700"
            )}
          >
            {delta}
          </span>
        ) : null}
      </div>
      <div className="mt-3">{right}</div>
    </div>
  );
}

function Bars({ a, b }: { a: number[]; b: number[] }) {
  const max = Math.max(1, ...a, ...b);
  return (
    <div className="mt-4 grid grid-cols-7 items-end gap-3">
      {a.map((av, i) => {
        const bv = b[i] ?? 0;
        return (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="flex items-end gap-1">
              <div className="w-4 rounded-t-lg bg-emerald-600" style={{ height: `${Math.max(6, Math.round((av / max) * 140))}px` }} aria-hidden />
              <div className="w-4 rounded-t-lg bg-amber-400" style={{ height: `${Math.max(6, Math.round((bv / max) * 140))}px` }} aria-hidden />
            </div>
            <div className="text-[11px] text-slate-500">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarCard() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const selected = 10;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">Calendar</div>
        <div className="text-xs text-slate-500">Jun 2026</div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-[11px] text-slate-500">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="grid h-7 place-items-center font-semibold">
            {d}
          </div>
        ))}
        {days.map((d) => (
          <button
            key={d}
            type="button"
            className={clsx(
              "grid h-7 place-items-center rounded-lg transition",
              d === selected ? "bg-emerald-700 text-white" : "text-slate-700 hover:bg-slate-50"
            )}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="text-xs font-semibold text-slate-700">Activity Details</div>
        <div className="mt-2 space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-600" /> Appointment</span>
            <span className="font-semibold">Dr. Risk Appointment</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500" /> Meeting</span>
            <span className="font-semibold">Dentist Meetup</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-400" /> Surgery</span>
            <span className="font-semibold">John Surgery</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button variant="secondary" size="sm">
          + Add new
        </Button>
      </div>
    </div>
  );
}

export function DashboardOverviewPanel() {
  const alerts = useAlerts();
  const notificationCount = alerts.items.filter((i) => i.type === "high_risk_alert" || i.type === "drug_alert").length;

  const seriesA = [950, 792, 501, 800, 500, 500, 280];
  const seriesB = [480, 493, 150, 523, 150, 150, 100];

  const [q, setQ] = useState("");
  const tableRows = useMemo(() => {
    const rows = [
      { id: "01", code: "#FUP121312424", name: "Isagi Yoichi", age: 20, date: "25 Dec 2023", time: "08:30 pm", type: "FUP+ECG", status: "Pending" },
      { id: "02", code: "#121312424", name: "Kaiser Brown", age: 23, date: "01 Dec 2023", time: "12:30 pm", type: "FUP", status: "Confirmed" },
      { id: "03", code: "#981245112", name: "Mina Ashido", age: 32, date: "03 Dec 2023", time: "09:10 am", type: "Lab", status: "Confirmed" }
    ];
    const norm = q.trim().toLowerCase();
    if (!norm) return rows;
    return rows.filter((r) => `${r.name} ${r.code}`.toLowerCase().includes(norm));
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-4">
        <KpiCard
          title="Overall visitors"
          value="10,525"
          delta="+15.2%"
          tone="accent"
          right={
            <div className="mt-4 text-sm text-emerald-50/90">
              Data obtained for the last 7 days.
              <div className="mt-3 h-[64px] text-white">
                <Sparkline values={[4, 5, 4, 6, 8, 7, 9, 10, 11, 12]} stroke="rgba(255,255,255,0.95)" fill="rgba(255,255,255,0.12)" />
              </div>
            </div>
          }
        />
        <KpiCard
          title="Total patient"
          value="5,715"
          delta="+10.4%"
          right={
            <div className="mt-2 h-[64px]">
              <Sparkline values={[2, 3, 3, 4, 3, 5, 6, 5, 6, 7]} stroke="#10b981" fill="rgba(16,185,129,0.12)" />
            </div>
          }
        />
        <KpiCard
          title="Surgery"
          value="523"
          delta="+165"
          right={
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 w-[72%] rounded-full bg-emerald-600" />
              </div>
              <div className="mt-2 text-xs text-slate-500">Visitor data obtained for the last 7 days.</div>
            </div>
          }
        />
        <KpiCard
          title="Overall Room"
          value="221"
          delta="+165"
          right={
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-lg bg-sky-50 text-sky-700">G</span> General Room</span>
                <span className="font-semibold">110</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-lg bg-emerald-50 text-emerald-700">P</span> Private Room</span>
                <span className="font-semibold">111</span>
              </div>
            </div>
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Patient Statistics</div>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-600" /> Patient</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-400" /> Inpatient</span>
              </div>
            </div>
            <Badge tone="slate">Last 7 days</Badge>
          </div>
          <Bars a={seriesA} b={seriesB} />
        </div>

        <div className="lg:col-span-4">
          <CalendarCard />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">All Patients</div>
            <div className="mt-0.5 text-xs text-slate-500">Quick lookup list (demo), notifications: {notificationCount}</div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[260px]">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search anything here" />
            </div>
            <Button variant="secondary">Filter</Button>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-12 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <div className="col-span-1">No</div>
            <div className="col-span-2">ID Code</div>
            <div className="col-span-3">Patient Name</div>
            <div className="col-span-1">Age</div>
            <div className="col-span-2">Created Date</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-1">Status</div>
          </div>
          <div className="divide-y divide-slate-200 bg-white">
            {tableRows.map((r) => (
              <div key={r.id} className="grid grid-cols-12 items-center px-4 py-3 text-sm">
                <div className="col-span-1 font-semibold text-slate-900">{r.id}</div>
                <div className="col-span-2 text-slate-600">{r.code}</div>
                <div className="col-span-3 font-medium text-slate-900">{r.name}</div>
                <div className="col-span-1 text-slate-700">{r.age}</div>
                <div className="col-span-2 text-slate-700">{r.date}</div>
                <div className="col-span-2 text-slate-700">{r.time}</div>
                <div className="col-span-1">
                  <span className={clsx("inline-flex rounded-full px-2 py-1 text-[11px] font-semibold", r.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700")}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

