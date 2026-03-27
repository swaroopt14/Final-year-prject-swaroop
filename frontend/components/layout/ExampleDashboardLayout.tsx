"use client";

import { useMemo, useState } from "react";
import type { AgentStatus, Role } from "./sidebar.config";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAlertsStream } from "@/lib/useAlertsStream";
import { tokenStore } from "@/lib/tokenStore";
import { Badge } from "@/components/ui/Badge";

function agentMeshStatus(connected: boolean): AgentStatus {
  return connected ? "online" : "offline";
}

export function ExampleDashboardLayout({ children }: { children: React.ReactNode }) {
  const [role] = useState<Role>("doctor");
  const [token] = useState(() => tokenStore.get());
  const alerts = useAlertsStream({ token });

  const badges = useMemo(() => {
    const critical = alerts.items.filter((i) => i.type === "high_risk_alert").length;
    const drug = alerts.items.filter((i) => i.type === "drug_alert").length;
    return {
      critical_alerts: critical,
      drug_alerts: drug
    };
  }, [alerts.items]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="mx-auto flex max-w-[1400px] gap-4">
        <Sidebar
          role={role}
          badges={badges}
          agentStatuses={{ agent_mesh: agentMeshStatus(alerts.connected) }}
          agentStatusSummary={{
            label: "Agent Mesh",
            status: agentMeshStatus(alerts.connected),
            detail: alerts.connected ? "Real-time stream connected" : "Real-time stream disconnected"
          }}
        />

        <main className="flex-1 space-y-4">
          <Topbar
            title="Staffs & Patients Overview"
            subtitle="Track patients, vitals, labs, prescriptions, and multi-agent workflows"
            right={<Badge tone={token ? "green" : "red"}>{token ? "Authenticated" : "No Token"}</Badge>}
          />
          {children}
        </main>
      </div>
    </div>
  );
}

