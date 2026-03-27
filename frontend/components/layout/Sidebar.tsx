"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import type { AgentStatus, Role } from "./sidebar.config";
import { sidebarConfig } from "./sidebar.config";
import { SidebarGroup } from "./SidebarGroup";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "smart_hospital_sidebar_collapsed";

function roleLabel(role: Role) {
  switch (role) {
    case "doctor":
      return "Doctor Console";
    case "nurse":
      return "Nurse Station";
    case "admin":
      return "Admin Control";
    case "patient":
      return "Patient Portal";
  }
}

function statusTone(status: AgentStatus) {
  switch (status) {
    case "online":
      return "bg-emerald-500";
    case "degraded":
      return "bg-amber-500";
    case "offline":
    default:
      return "bg-rose-500";
  }
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      className={clsx("h-4 w-4 transition-transform", collapsed ? "rotate-180" : "")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function Sidebar({
  role,
  className,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  badges,
  agentStatuses,
  agentStatusSummary
}: {
  role: Role;
  className?: string;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  badges?: Record<string, number | undefined>;
  agentStatuses?: Record<string, AgentStatus | undefined>;
  agentStatusSummary?: { label: string; status: AgentStatus; detail?: string };
}) {
  const pathname = usePathname() || "/";

  const [collapsedState, setCollapsedState] = useState(defaultCollapsed);
  const collapsed = collapsedProp ?? collapsedState;

  useEffect(() => {
    if (collapsedProp !== undefined) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "1") setCollapsedState(true);
      if (raw === "0") setCollapsedState(false);
    } catch {}
  }, [collapsedProp]);

  function setCollapsed(next: boolean) {
    onCollapsedChange?.(next);
    if (collapsedProp === undefined) setCollapsedState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {}
  }

  const groups = sidebarConfig[role];

  const isItemActive = useMemo(() => {
    return (path: string, mode: "exact" | "prefix" = "prefix") => {
      if (!path) return false;
      if (mode === "exact") return pathname === path;
      if (pathname === path) return true;
      return pathname.startsWith(path.endsWith("/") ? path : `${path}/`);
    };
  }, [pathname]);

  const getBadgeValue = useMemo(() => {
    return (badgeKey?: string) => {
      if (!badgeKey) return 0;
      const v = badges?.[badgeKey];
      return typeof v === "number" && v > 0 ? v : 0;
    };
  }, [badges]);

  const getStatus = useMemo(() => {
    return (statusKey?: string) => {
      if (!statusKey) return undefined;
      return agentStatuses?.[statusKey] ?? undefined;
    };
  }, [agentStatuses]);

  return (
    <aside
      className={clsx("hidden shrink-0 lg:block", collapsed ? "w-[72px]" : "w-[280px]", className)}
      aria-label="Primary navigation"
    >
      <div className="card sticky top-4 flex h-[calc(100vh-32px)] flex-col overflow-hidden">
        <div className={clsx("flex items-center gap-3 px-4 py-4", collapsed ? "justify-center px-2" : "")}>
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-600 text-white shadow-sm">
            <span className="text-sm font-semibold">SH</span>
          </div>
          {collapsed ? null : (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-wide text-slate-900">Smart Hospital</div>
              <div className="-mt-0.5 truncate text-[11px] text-slate-500">Multi-Agent System</div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={clsx(
              "ml-auto grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-200",
              collapsed ? "ml-0" : ""
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
        </div>

        {collapsed ? null : (
          <div className="px-4 pb-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold text-slate-800">{roleLabel(role)}</div>
                  <div className="truncate text-[11px] text-slate-500">Role-based modules & monitoring</div>
                </div>
                {agentStatusSummary ? (
                  <div className="flex items-center gap-2">
                    <span className={clsx("h-2.5 w-2.5 rounded-full", statusTone(agentStatusSummary.status))} aria-hidden />
                    <span className="text-[11px] font-medium text-slate-600">{agentStatusSummary.label}</span>
                  </div>
                ) : null}
              </div>
              {agentStatusSummary?.detail ? (
                <div className="mt-1 text-[11px] text-slate-500">{agentStatusSummary.detail}</div>
              ) : null}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-1 pb-2">
          {groups.map((g) => (
            <SidebarGroup
              key={g.id}
              group={g}
              collapsed={collapsed}
              isItemActive={isItemActive}
              getBadgeValue={getBadgeValue}
              getStatus={getStatus}
            />
          ))}
        </div>

        <div className={clsx("border-t border-slate-200 px-2 py-2", collapsed ? "px-1" : "px-3")}>
          <div className={clsx("flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2", collapsed ? "justify-center px-2" : "")}>
            <span className="h-2 w-2 rounded-full bg-sky-600" aria-hidden />
            {collapsed ? null : (
              <div className="min-w-0 text-[11px] text-slate-600">
                <span className="font-semibold text-slate-700">Clinical Intelligence</span> • AI modules, agents, alerts
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

