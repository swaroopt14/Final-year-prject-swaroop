"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import clsx from "clsx";

function BellIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

export function DashboardHeader({
  title,
  subtitle,
  userName = "Alexandro",
  notificationCount = 0
}: {
  title: string;
  subtitle?: string;
  userName?: string;
  notificationCount?: number;
}) {
  return (
    <div className="card px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="w-full md:max-w-[420px]">
            <Input placeholder="Search anything here" />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Badge tone="slate">Last Week</Badge>
            <Button variant="secondary">Export</Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          <div className="relative">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
              aria-label="Notifications"
            >
              <BellIcon />
            </button>
            {notificationCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
            aria-label="User menu"
          >
            <span className={clsx("grid h-7 w-7 place-items-center rounded-lg bg-slate-900 text-white text-xs font-semibold")}>
              {userName.slice(0, 1).toUpperCase()}
            </span>
            <span className="font-medium">{userName}</span>
            <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <div className="text-2xl font-semibold text-slate-900">{title}</div>
        {subtitle ? <div className="text-sm text-slate-500">{subtitle}</div> : null}
      </div>
    </div>
  );
}

