"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";
import { useAlerts } from "@/lib/alerts-context";

type Severity = "critical" | "warning" | "info";

function severityForType(type: string): Severity {
  switch (type) {
    case "high_risk_alert":
      return "critical";
    case "drug_alert":
      return "warning";
    case "vitals.stream":
      return "info";
    default:
      return "info";
  }
}

function toneForSeverity(sev: Severity) {
  switch (sev) {
    case "critical":
      return "red" as const;
    case "warning":
      return "yellow" as const;
    case "info":
    default:
      return "sky" as const;
  }
}

function formatWhen(at: number) {
  const s = Math.max(0, Math.floor((Date.now() - at) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function AlertCenter({ title = "Alerts & Triage" }: { title?: string }) {
  const alerts = useAlerts();

  const [filter, setFilter] = useState<"all" | "high_risk_alert" | "drug_alert" | "vitals.stream">("all");
  const [ack, setAck] = useState<Record<number, boolean>>({});

  const items = useMemo(() => {
    const base = alerts.items;
    const filtered = filter === "all" ? base : base.filter((i) => i.type === filter);
    return filtered.slice(0, 50);
  }, [alerts.items, filter]);

  const counts = useMemo(() => {
    const c = {
      high: alerts.items.filter((i) => i.type === "high_risk_alert").length,
      drug: alerts.items.filter((i) => i.type === "drug_alert").length,
      vitals: alerts.items.filter((i) => i.type === "vitals.stream").length
    };
    return c;
  }, [alerts.items]);

  return (
    <Card>
      <CardHeader
        title={title}
        subtitle="Event-driven monitoring (streamed) with lightweight triage controls"
        right={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge tone={alerts.connected ? "green" : "red"}>{alerts.connected ? "Stream Live" : "Stream Offline"}</Badge>
            <Badge tone="red">High-Risk: {counts.high}</Badge>
            <Badge tone="yellow">Drug: {counts.drug}</Badge>
            <Badge tone="sky">Vitals: {counts.vitals}</Badge>
          </div>
        }
      />
      <CardBody className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button variant={filter === "all" ? "primary" : "secondary"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button
            variant={filter === "high_risk_alert" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter("high_risk_alert")}
          >
            High-Risk
          </Button>
          <Button
            variant={filter === "drug_alert" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter("drug_alert")}
          >
            Drug
          </Button>
          <Button
            variant={filter === "vitals.stream" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter("vitals.stream")}
          >
            Vitals
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <div className="col-span-2">Severity</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-5">Summary</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          <div className="divide-y divide-slate-200">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-sm text-slate-600">No events yet.</div>
            ) : (
              items.map((it) => {
                const sev = severityForType(it.type);
                const tone = toneForSeverity(sev);
                const isAck = !!ack[it.at];
                return (
                  <div key={it.at} className={clsx("grid grid-cols-12 items-center gap-3 px-4 py-3", isAck ? "opacity-60" : "")}>
                    <div className="col-span-2">
                      <Badge tone={tone}>{sev.toUpperCase()}</Badge>
                    </div>
                    <div className="col-span-3">
                      <div className="text-sm font-medium text-slate-900">{it.type}</div>
                      <div className="text-[11px] text-slate-500">{formatWhen(it.at)}</div>
                    </div>
                    <div className="col-span-5">
                      <div className="truncate text-sm text-slate-700">
                        {typeof it.payload === "object" && it.payload
                          ? JSON.stringify(it.payload)
                          : String(it.payload ?? "—")}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500">Trace: event stream</div>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button
                        variant={isAck ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setAck((p) => ({ ...p, [it.at]: !p[it.at] }))}
                      >
                        {isAck ? "Unack" : "Acknowledge"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
