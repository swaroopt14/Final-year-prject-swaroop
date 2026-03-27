"use client";

import { useMemo, useState } from "react";
import type { AgentStatus, Role } from "@/components/layout/sidebar.config";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAlertsStream } from "@/lib/useAlertsStream";
import { tokenStore } from "@/lib/tokenStore";
import { AlertsProvider } from "@/lib/alerts-context";
import { useMockVitalsSimulation } from "@/lib/useMockVitalsSimulation";

function agentMeshStatus(connected: boolean, tokenPresent: boolean): AgentStatus {
  if (!tokenPresent) return "offline";
  return connected ? "online" : "offline";
}

export function RoleShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const [token] = useState(() => tokenStore.get());
  const tokenPresent = !!token;
  const liveAlerts = useAlertsStream({ token });
  const mockSim = useMockVitalsSimulation({ enabled: !tokenPresent });

  const alerts = useMemo(() => {
    if (tokenPresent) return liveAlerts;
    return mockSim;
  }, [tokenPresent, liveAlerts, mockSim]);

  const badges = useMemo(() => {
    const critical = alerts.items.filter((i) => i.type === "high_risk_alert").length;
    const drug = alerts.items.filter((i) => i.type === "drug_alert").length;
    return {
      critical_alerts: critical,
      drug_alerts: drug,
      messages: 0
    };
  }, [alerts.items]);

  const mesh = agentMeshStatus(alerts.connected, tokenPresent);

  return (
    <AlertsProvider value={alerts}>
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="mx-auto flex max-w-[1400px] gap-4">
          <Sidebar
            role={role}
            badges={badges}
            agentStatuses={{ agent_mesh: mesh }}
            agentStatusSummary={{
              label: "Agent Mesh",
              status: mesh,
              detail: tokenPresent
                ? alerts.connected
                  ? "Real-time monitoring connected"
                  : "Real-time monitoring disconnected"
                : "Mock data mode (no token)"
            }}
          />
          <main className="flex-1 space-y-4">{children}</main>
        </div>
      </div>
    </AlertsProvider>
  );
}
