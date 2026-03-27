"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAlerts } from "@/lib/alerts-context";

function healthFromStream(connected: boolean) {
  return connected ? ("green" as const) : ("red" as const);
}

export function AgentHealthPanel() {
  const alerts = useAlerts();

  const stats = useMemo(() => {
    const byType = new Map<string, number>();
    for (const it of alerts.items) byType.set(it.type, (byType.get(it.type) ?? 0) + 1);
    const top = Array.from(byType.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return { total: alerts.items.length, top };
  }, [alerts.items]);

  return (
    <Card>
      <CardHeader
        title="Agent Mesh Health"
        subtitle="Operational view: stream connectivity and recent event throughput"
        right={<Badge tone={healthFromStream(alerts.connected)}>{alerts.connected ? "Connected" : "Disconnected"}</Badge>}
      />
      <CardBody className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500">Stream Status</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{alerts.connected ? "ONLINE" : "OFFLINE"}</div>
            <div className="mt-1 text-xs text-slate-500">SSE channel to `/api/events/stream`</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500">Events Buffered</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{stats.total}</div>
            <div className="mt-1 text-xs text-slate-500">Client-side window (last 200)</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500">Primary Topics</div>
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              {stats.top.length ? (
                stats.top.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3">
                    <span className="truncate">{k}</span>
                    <span className="text-xs font-semibold text-slate-600">{v}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500">No events yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Next upgrade: add server-side agent heartbeats and queue lag metrics, then visualize them here per agent (Doctor/Nurse/Drug/Admin).
        </div>
      </CardBody>
    </Card>
  );
}
