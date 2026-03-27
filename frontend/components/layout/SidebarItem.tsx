"use client";

import Link from "next/link";
import clsx from "clsx";
import type { AgentStatus, SidebarIconName, SidebarItemConfig, SidebarBadgeVariant } from "./sidebar.config";

function iconClassName(className?: string) {
  return clsx("h-[18px] w-[18px] shrink-0", className);
}

function SidebarIcon({ name, className }: { name?: SidebarIconName; className?: string }) {
  const common = { className: iconClassName(className), viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <path d="M3 13h8V3H3v10Z" />
          <path d="M13 21h8V11h-8v10Z" />
          <path d="M13 3h8v6h-8V3Z" />
          <path d="M3 17h8v4H3v-4Z" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M21 21v-2a3 3 0 0 0-2-2.8" />
          <path d="M16 3.1a4 4 0 0 1 0 7.8" />
        </svg>
      );
    case "userPlus":
      return (
        <svg {...common}>
          <path d="M11 21H5a2 2 0 0 1-2-2v-1a4 4 0 0 1 4-4h4" />
          <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M19 8v6" />
          <path d="M16 11h6" />
        </svg>
      );
    case "history":
      return (
        <svg {...common}>
          <path d="M3 3v6h6" />
          <path d="M21 12a9 9 0 1 1-3-6.7L9 9" />
          <path d="M12 7v5l4 2" />
        </svg>
      );
    case "activity":
      return (
        <svg {...common}>
          <path d="M3 12h4l2-7 4 14 2-7h6" />
        </svg>
      );
    case "pulse":
      return (
        <svg {...common}>
          <path d="M4 13.5h3l2-7 4 14 2-7h5" />
          <path d="M20 13.5h0.5" />
        </svg>
      );
    case "siren":
      return (
        <svg {...common}>
          <path d="M12 3v2" />
          <path d="M4.5 7.5 6 9" />
          <path d="M19.5 7.5 18 9" />
          <path d="M8 13a4 4 0 1 1 8 0v1H8v-1Z" />
          <path d="M6 19h12" />
          <path d="M7 19v2" />
          <path d="M17 19v2" />
        </svg>
      );
    case "brain":
      return (
        <svg {...common}>
          <path d="M8 6a3 3 0 1 1 4-2" />
          <path d="M16 6a3 3 0 1 0-4-2" />
          <path d="M9 8a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3" />
          <path d="M15 8a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3" />
          <path d="M9 16v2a3 3 0 0 0 3 3" />
          <path d="M15 16v2a3 3 0 0 1-3 3" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg {...common}>
          <path d="M6 3v4a4 4 0 1 0 8 0V3" />
          <path d="M10 11v5a4 4 0 0 0 8 0v-1" />
          <path d="M18 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common}>
          <path d="M12 2l1.2 4.1L17 7.3l-3.8 1.2L12 13l-1.2-4.5L7 7.3l3.8-1.2L12 2Z" />
          <path d="M5 13l.7 2.4L8 16l-2.3.6L5 19l-.7-2.4L2 16l2.3-.6L5 13Z" />
          <path d="M19 14l.7 2.4L22 17l-2.3.6L19 20l-.7-2.4L16 17l2.3-.6L19 14Z" />
        </svg>
      );
    case "pill":
      return (
        <svg {...common}>
          <path d="M10.5 14.5 8 17a4 4 0 0 1-5.7-5.7l2.5-2.5a4 4 0 0 1 5.7 5.7Z" />
          <path d="M13.5 9.5 16 7a4 4 0 0 1 5.7 5.7l-2.5 2.5a4 4 0 0 1-5.7-5.7Z" />
          <path d="M8 8l8 8" />
        </svg>
      );
    case "testTube":
      return (
        <svg {...common}>
          <path d="M9 2h6" />
          <path d="M10 2v6l-5.5 9.5A4 4 0 0 0 8 22h8a4 4 0 0 0 3.5-4.5L14 8V2" />
          <path d="M8 16h8" />
        </svg>
      );
    case "upload":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="M7 8l5-5 5 5" />
          <path d="M21 21H3" />
        </svg>
      );
    case "bot":
      return (
        <svg {...common}>
          <path d="M12 8V4" />
          <path d="M8 4h8" />
          <path d="M6 12a6 6 0 0 1 12 0v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5Z" />
          <path d="M9 13h0.01" />
          <path d="M15 13h0.01" />
          <path d="M9 16h6" />
        </svg>
      );
    case "scrollText":
      return (
        <svg {...common}>
          <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7" />
          <path d="M7 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" />
          <path d="M9 8h8" />
          <path d="M9 12h8" />
          <path d="M9 16h6" />
        </svg>
      );
    case "barChart":
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M7 15v3" />
          <path d="M11 11v7" />
          <path d="M15 7v11" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 2 20 6v6c0 5-3.2 9.5-8 10-4.8-.5-8-5-8-10V6l8-4Z" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19.4 15a1.8 1.8 0 0 0 .3 2l.1.1-1.6 2.8-0.2-.1a1.8 1.8 0 0 0-2-.3l-.2.1-2-1.1a1.8 1.8 0 0 0-1 .1h-.2a1.8 1.8 0 0 0-1.4 0h-.2a1.8 1.8 0 0 0-1-.1l-2 1.1-.2-.1a1.8 1.8 0 0 0-2 .3l-.2.1L2.2 17l.1-.1a1.8 1.8 0 0 0 .3-2l-.1-.2V12l.1-.2a1.8 1.8 0 0 0-.3-2l-.1-.1L3.8 4.9l.2.1a1.8 1.8 0 0 0 2 .3l.2-.1 2 1.1a1.8 1.8 0 0 0 1-.1h.2a1.8 1.8 0 0 0 1.4 0h.2a1.8 1.8 0 0 0 1 .1l2-1.1.2.1a1.8 1.8 0 0 0 2-.3l.2-.1 1.6 2.8-.1.1a1.8 1.8 0 0 0-.3 2l.1.2v2.6l-.1.2Z" />
        </svg>
      );
    case "logOut":
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        </svg>
      );
    case "fileText":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h6" />
        </svg>
      );
    case "hospital":
      return (
        <svg {...common}>
          <path d="M3 21V8a2 2 0 0 1 2-2h5V3h4v3h5a2 2 0 0 1 2 2v13" />
          <path d="M7 21v-6h10v6" />
          <path d="M12 8v4" />
          <path d="M10 10h4" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <path d="M3 8h18" />
          <path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "database":
      return (
        <svg {...common}>
          <path d="M12 2c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Z" />
          <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        </svg>
      );
    case "workflow":
      return (
        <svg {...common}>
          <path d="M7 7h6v6H7V7Z" />
          <path d="M17 11h0.01" />
          <path d="M17 7h0.01" />
          <path d="M17 15h0.01" />
          <path d="M13 10h4" />
          <path d="M13 14h4" />
        </svg>
      );
    case "blocks":
      return (
        <svg {...common}>
          <path d="M4 7a2 2 0 0 1 2-2h3v3a2 2 0 0 1-2 2H4V7Z" />
          <path d="M10 5h3a2 2 0 0 1 2 2v3h-3a2 2 0 0 1-2-2V5Z" />
          <path d="M4 14h3a2 2 0 0 1 2 2v3H6a2 2 0 0 1-2-2v-3Z" />
          <path d="M12 14h3v3a2 2 0 0 1-2 2h-3v-3a2 2 0 0 1 2-2Z" />
        </svg>
      );
    default:
      return <span className={iconClassName(className)} aria-hidden />;
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

function BadgePill({ value, variant }: { value: number; variant: SidebarBadgeVariant }) {
  if (value <= 0) return null;
  if (variant === "dot") {
    return <span className="ml-auto h-2 w-2 rounded-full bg-rose-500" aria-label="New" />;
  }
  return (
    <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">
      {value > 99 ? "99+" : value}
    </span>
  );
}

export function SidebarItem({
  item,
  active,
  collapsed,
  badgeValue = 0,
  status
}: {
  item: SidebarItemConfig;
  active: boolean;
  collapsed: boolean;
  badgeValue?: number;
  status?: AgentStatus;
}) {
  const base =
    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-200";
  const tone = active
    ? "border border-sky-100 bg-sky-50 text-sky-800"
    : "border border-transparent text-slate-700 hover:bg-slate-100";
  const disabled = item.disabled ? "pointer-events-none opacity-50" : "";

  const label = (
    <>
      <span className="truncate">{item.label}</span>
      {item.badgeKey ? <BadgePill value={badgeValue} variant={item.badgeVariant ?? "count"} /> : null}
      {item.statusKey && status ? (
        <span className={clsx("ml-auto h-2.5 w-2.5 rounded-full ring-2 ring-white", statusTone(status))} aria-hidden />
      ) : null}
    </>
  );

  const inner = (
    <>
      <span
        className={clsx(
          "grid h-8 w-8 place-items-center rounded-xl border",
          active ? "border-sky-100 bg-white text-sky-700" : "border-slate-200 bg-white text-slate-600 group-hover:text-slate-900"
        )}
        aria-hidden
      >
        <SidebarIcon name={item.icon} />
      </span>
      {collapsed ? <span className="sr-only">{item.label}</span> : label}
    </>
  );

  const commonProps = {
    className: clsx(base, tone, disabled),
    title: collapsed ? item.label : undefined,
    "aria-current": active ? ("page" as const) : undefined
  };

  if (item.external) {
    return (
      <a {...commonProps} href={item.path} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <Link {...commonProps} href={item.path}>
      {inner}
    </Link>
  );
}

