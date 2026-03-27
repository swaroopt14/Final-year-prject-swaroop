"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import clsx from "clsx";

type HistoryItem = {
  id: string;
  at: string;
  patient: string;
  mrn: string;
  actor: "Nurse Agent" | "Doctor Agent" | "DrugChecker Agent" | "Admin Agent";
  action: string;
  severity: "info" | "warning" | "critical";
};

const mockHistory: HistoryItem[] = [
  {
    id: "h1",
    at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    patient: "Imran Khan",
    mrn: "MRN-000778",
    actor: "Nurse Agent",
    action: "Triggered high-risk alert due to low SpO₂ and fever.",
    severity: "critical"
  },
  {
    id: "h2",
    at: new Date(Date.now() - 44 * 60 * 1000).toISOString(),
    patient: "Aarav Patil",
    mrn: "MRN-000145",
    actor: "DrugChecker Agent",
    action: "Flagged potential interaction: warfarin + aspirin (high).",
    severity: "warning"
  },
  {
    id: "h3",
    at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    patient: "Sara Sharma",
    mrn: "MRN-000321",
    actor: "Doctor Agent",
    action: "Completed evaluation and recommended observation (risk medium).",
    severity: "info"
  }
];

function tone(sev: HistoryItem["severity"]) {
  if (sev === "critical") return "red" as const;
  if (sev === "warning") return "yellow" as const;
  return "slate" as const;
}

export function PatientHistoryPanel() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | HistoryItem["severity"]>("all");

  const rows = useMemo(() => {
    const norm = q.trim().toLowerCase();
    return mockHistory
      .filter((h) => (filter === "all" ? true : h.severity === filter))
      .filter((h) => {
        if (!norm) return true;
        return `${h.patient} ${h.mrn} ${h.actor} ${h.action}`.toLowerCase().includes(norm);
      })
      .sort((a, b) => (a.at < b.at ? 1 : -1));
  }, [q, filter]);

  return (
    <Card>
      <CardHeader
        title="Patient History"
        subtitle="Unified timeline of agent activity and clinical events (mock view)"
        right={<Badge tone="yellow">Mock Data</Badge>}
      />
      <CardBody className="space-y-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-[420px]">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search history (patient, MRN, agent, action…)" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "info", "warning", "critical"] as const).map((x) => (
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

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <div className="col-span-2">Severity</div>
            <div className="col-span-3">Patient</div>
            <div className="col-span-2">MRN</div>
            <div className="col-span-2">Actor</div>
            <div className="col-span-3">Action</div>
          </div>
          <div className="divide-y divide-slate-200">
            {rows.map((h) => (
              <div key={h.id} className="grid grid-cols-12 items-center gap-3 px-4 py-3">
                <div className="col-span-2">
                  <Badge tone={tone(h.severity)}>{h.severity.toUpperCase()}</Badge>
                  <div className="mt-1 text-[11px] text-slate-500">{new Date(h.at).toLocaleString()}</div>
                </div>
                <div className="col-span-3 text-sm font-medium text-slate-900">{h.patient}</div>
                <div className="col-span-2 text-sm text-slate-700">{h.mrn}</div>
                <div className="col-span-2 text-sm text-slate-700">{h.actor}</div>
                <div className="col-span-3 text-sm text-slate-700">{h.action}</div>
              </div>
            ))}
            {rows.length === 0 ? <div className="px-4 py-10 text-sm text-slate-600">No history items.</div> : null}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

