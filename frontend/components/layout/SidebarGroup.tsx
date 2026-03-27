"use client";

import clsx from "clsx";
import type { SidebarGroupConfig, AgentStatus } from "./sidebar.config";
import { SidebarItem } from "./SidebarItem";

export function SidebarGroup({
  group,
  collapsed,
  isItemActive,
  getBadgeValue,
  getStatus
}: {
  group: SidebarGroupConfig;
  collapsed: boolean;
  isItemActive: (path: string, mode?: "exact" | "prefix") => boolean;
  getBadgeValue: (badgeKey?: string) => number;
  getStatus: (statusKey?: string) => AgentStatus | undefined;
}) {
  return (
    <section aria-label={group.label} className="px-2 py-2">
      {collapsed ? (
        <div className="my-2 h-px bg-slate-200/80" aria-hidden />
      ) : (
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {group.label}
        </div>
      )}
      <nav className={clsx("space-y-1", collapsed ? "pt-1" : "")}>
        {group.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            active={isItemActive(item.path, item.activeMatch)}
            badgeValue={getBadgeValue(item.badgeKey)}
            status={getStatus(item.statusKey)}
          />
        ))}
      </nav>
    </section>
  );
}

