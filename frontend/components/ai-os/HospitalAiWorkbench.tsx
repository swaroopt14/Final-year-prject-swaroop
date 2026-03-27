"use client";

import Link from "next/link";
import clsx from "clsx";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState
} from "react";
import { usePathname } from "next/navigation";
import { Sparkline } from "@/components/charts/Sparkline";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  adminSignals,
  chatSeed,
  criticalAlerts,
  doctorDecisions,
  drugMatrix,
  insightCards,
  logs,
  metricCards,
  modelRegistry,
  navigationItems,
  nurseQueue,
  pageMeta,
  patients,
  predictionBuckets,
  predictionSeries,
  promptSuggestions,
  settingsGroups,
  streamPatients,
  type AgentName,
  type ChatMessage,
  type IntelligenceAlert,
  type InsightCard,
  type LogItem,
  type MetricCard,
  type ModelRegistryItem,
  type PageSlug,
  type PatientRecord
} from "@/lib/ai-hospital-data";
import { tokenStore } from "@/lib/tokenStore";
import { useAlertsStream } from "@/lib/useAlertsStream";
import { useMockVitalsSimulation } from "@/lib/useMockVitalsSimulation";

type StreamEvent = { type: string; at: number; payload: unknown };

type WorkbenchProps = {
  slug: PageSlug;
};

function Icon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "dashboard":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 13.2h7.8V21H3zM13.2 3H21v10.2h-7.8zM13.2 15.2H21V21h-7.8zM3 3h7.8v8.2H3z" />
        </svg>
      );
    case "patients":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M17 11h6" />
        </svg>
      );
    case "alerts":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10.3 3.4 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z" />
          <path d="M12 8v5M12 17h.01" />
        </svg>
      );
    case "insights":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3a7 7 0 0 0-4 12.8V19a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3.2A7 7 0 0 0 12 3Z" />
          <path d="M9 10h6M10 14h4" />
        </svg>
      );
    case "chat":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 10h10M7 14h7" />
          <path d="M4 5h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4V7a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "doctor":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 21v-8M8 17h8M7 3h10l2 3-2 3H7L5 6l2-3Z" />
        </svg>
      );
    case "nurse":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 4v8M8 8h8M6 3h12v8a6 6 0 1 1-12 0V3Z" />
        </svg>
      );
    case "drug":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m9 4 11 11M14 4l6 6a3 3 0 0 1 0 4.2l-.8.8a3 3 0 0 1-4.2 0l-6-6a3 3 0 0 1 0-4.2l.8-.8A3 3 0 0 1 14 4ZM5 19l4-4" />
        </svg>
      );
    case "admin":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3 3 8l9 5 9-5-9-5ZM5 10.5V16l7 4 7-4v-5.5" />
        </svg>
      );
    case "predictions":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
        </svg>
      );
    case "vitals":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      );
    case "load":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 20V9M10 20V4M16 20v-7M22 20v-4" />
        </svg>
      );
    case "settings":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
          <path d="m19.4 15 1.1 1.8-1.7 2.9-2.1-.3a8.6 8.6 0 0 1-1.7 1l-.4 2.1H9.4L9 20.4a8.6 8.6 0 0 1-1.7-1l-2.1.3-1.7-2.9L4.6 15a8.9 8.9 0 0 1 0-2l-1.1-1.8 1.7-2.9 2.1.3a8.6 8.6 0 0 1 1.7-1L9.4 3h5.2l.4 2.1a8.6 8.6 0 0 1 1.7 1l2.1-.3 1.7 2.9L19.4 11a8.9 8.9 0 0 1 0 4Z" />
        </svg>
      );
    case "logs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "models":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" />
        </svg>
      );
    default:
      return null;
  }
}

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

function toneClasses(tone: MetricCard["tone"]) {
  switch (tone) {
    case "critical":
      return "from-rose-500/20 via-rose-500/10 to-transparent text-rose-100 shadow-[0_0_0_1px_rgba(251,113,133,0.18)]";
    case "warning":
      return "from-amber-400/20 via-amber-300/10 to-transparent text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.16)]";
    case "good":
      return "from-emerald-400/20 via-emerald-300/10 to-transparent text-emerald-100 shadow-[0_0_0_1px_rgba(52,211,153,0.16)]";
    case "info":
    default:
      return "from-cyan-400/20 via-cyan-300/10 to-transparent text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.16)]";
  }
}

function severityTone(severity: IntelligenceAlert["severity"]) {
  if (severity === "Critical") return "bg-rose-500/14 text-rose-100 ring-1 ring-inset ring-rose-500/20";
  if (severity === "High") return "bg-amber-400/12 text-amber-100 ring-1 ring-inset ring-amber-400/18";
  return "bg-cyan-400/12 text-cyan-100 ring-1 ring-inset ring-cyan-400/18";
}

function statusTone(status: PatientRecord["status"]) {
  switch (status) {
    case "Critical":
      return "bg-rose-500/14 text-rose-100 ring-1 ring-inset ring-rose-500/20";
    case "Watch":
      return "bg-amber-400/12 text-amber-100 ring-1 ring-inset ring-amber-400/18";
    case "Improving":
      return "bg-cyan-400/12 text-cyan-100 ring-1 ring-inset ring-cyan-400/18";
    case "Stable":
    default:
      return "bg-emerald-500/14 text-emerald-100 ring-1 ring-inset ring-emerald-500/20";
  }
}

function insightTone(accent: InsightCard["accent"]) {
  switch (accent) {
    case "red":
      return "before:bg-rose-400";
    case "emerald":
      return "before:bg-emerald-400";
    case "amber":
      return "before:bg-amber-300";
    case "violet":
      return "before:bg-violet-400";
    case "cyan":
    default:
      return "before:bg-cyan-400";
  }
}

function statusForModel(status: ModelRegistryItem["status"]) {
  if (status === "Healthy") return "bg-emerald-500/14 text-emerald-100";
  if (status === "Monitoring") return "bg-amber-400/12 text-amber-100";
  return "bg-rose-500/14 text-rose-100";
}

function groupNavigation() {
  return [
    { label: "Main", items: navigationItems.filter((item) => item.section === "Main") },
    { label: "Agents", items: navigationItems.filter((item) => item.section === "Agents") },
    { label: "Analytics", items: navigationItems.filter((item) => item.section === "Analytics") },
    { label: "System", items: navigationItems.filter((item) => item.section === "System") }
  ];
}

function agentReply(input: string, patient: PatientRecord) {
  const text = input.toLowerCase();
  if (text.includes("drug") || text.includes("med") || text.includes("allergy")) {
    return {
      agent: "Drug Agent" as AgentName,
      body: `${patient.firstName}'s highest medication risk is ${patient.medications[0]} plus current safety constraints. The AI block is active because ${patient.reason.toLowerCase()}`
    };
  }

  if (text.includes("load") || text.includes("icu") || text.includes("staff") || text.includes("hospital")) {
    return {
      agent: "Admin Agent" as AgentName,
      body: `Hospital load is tight because ICU availability is down to 3 beds and the ER is running at 91% occupancy. Admin Agent recommends preserving one protected ICU slot for the next 90 minutes.`
    };
  }

  if (text.includes("vital") || text.includes("oxygen") || text.includes("monitor")) {
    return {
      agent: "Nurse Agent" as AgentName,
      body: `${patient.firstName}'s bedside trend shows HR ${patient.vitals.heartRateBpm} bpm, SpO2 ${patient.vitals.spo2Pct}%, and the last trend shift favors ${patient.status.toLowerCase()} monitoring with close reassessment.`
    };
  }

  return {
    agent: "Doctor Agent" as AgentName,
    body: `${patient.firstName} is currently classified as ${patient.status.toLowerCase()} because ${patient.reason.toLowerCase()} The leading diagnosis is ${patient.diagnosis} with ${formatConfidence(patient.confidence)} confidence from ${patient.model}.`
  };
}

function mapLiveAlerts(events: StreamEvent[]): IntelligenceAlert[] {
  return events
    .reduce<IntelligenceAlert[]>((acc, event, index) => {
      const payload = typeof event.payload === "object" && event.payload ? (event.payload as Record<string, unknown>) : {};
      const patientId = typeof payload.patientId === "string" ? payload.patientId : undefined;
      const patient = patients.find((item) => item.id === patientId);

      if (event.type === "high_risk_alert" && patient) {
        const rawScore = typeof payload.riskScore === "number" ? payload.riskScore : patient.riskScore / 100;
        acc.push(
          {
            id: `live-risk-${index}-${patient.id}`,
            title: `High Risk: ${Math.round(rawScore * 100)}%`,
            description: `${patient.firstName} ${patient.lastName} triggered a real-time deterioration signal from the streaming vitals feed.`,
            severity: "Critical" as const,
            agent: "Nurse Agent" as const,
            patientId: patient.id,
            tag: "Real-time alert",
            time: "Live now"
          }
        );
        return acc;
      }

      if (event.type === "vitals.stream" && patient) {
        const spo2 = typeof payload.spo2Pct === "number" ? payload.spo2Pct : patient.vitals.spo2Pct;
        const hr = typeof payload.heartRateBpm === "number" ? payload.heartRateBpm : patient.vitals.heartRateBpm;

        if (spo2 < 92) {
          acc.push(
            {
              id: `live-spo2-${index}-${patient.id}`,
              title: "Oxygen Dropped Below 92%",
              description: `${patient.firstName} ${patient.lastName} recorded SpO2 ${spo2}%. Nurse Agent recommends immediate bedside review.`,
              severity: "High" as const,
              agent: "Nurse Agent" as const,
              patientId: patient.id,
              tag: "Streaming vitals",
              time: "Live now"
            }
          );
          return acc;
        }

        if (hr > 125) {
          acc.push(
            {
              id: `live-hr-${index}-${patient.id}`,
              title: "Abnormal Heart Rate Detected",
              description: `${patient.firstName} ${patient.lastName} crossed ${hr} bpm in the continuous telemetry stream.`,
              severity: "High" as const,
              agent: "Nurse Agent" as const,
              patientId: patient.id,
              tag: "Telemetry alert",
              time: "Live now"
            }
          );
          return acc;
        }
      }

      return acc;
    }, [])
    .slice(0, 4);
}

function Panel({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={clsx(
        "panel relative overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.045] p-5 shadow-[0_18px_65px_rgba(2,8,23,0.36)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-200/70">{eyebrow}</div>
        <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
      </div>
      {action}
    </div>
  );
}

function AgentPill({ agent }: { agent: AgentName }) {
  const tone =
    agent === "Doctor Agent"
      ? "bg-cyan-400/12 text-cyan-100"
      : agent === "Nurse Agent"
        ? "bg-emerald-400/12 text-emerald-100"
        : agent === "Drug Agent"
          ? "bg-amber-400/12 text-amber-100"
          : "bg-violet-400/12 text-violet-100";

  return (
    <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium", tone)}>
      {agent}
    </span>
  );
}

function MiniMetric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{note}</div>
    </div>
  );
}

function MetricGrid({ items }: { items: MetricCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Panel
          key={item.id}
          className={clsx(
            "bg-gradient-to-br p-0",
            toneClasses(item.tone)
          )}
        >
          <div className="rounded-[28px] bg-slate-950/72 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-slate-200">{item.label}</div>
                <div className="mt-3 text-3xl font-semibold text-white">{item.value}</div>
              </div>
              <span className="rounded-full bg-white/7 px-3 py-1 text-xs font-medium text-slate-200">{item.delta}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{item.note}</p>
          </div>
        </Panel>
      ))}
    </div>
  );
}

function AlertCarousel({ alerts }: { alerts: IntelligenceAlert[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {alerts.map((alert) => (
        <Panel
          key={alert.id}
          className="min-w-[280px] flex-1 animate-[alertPulse_3.2s_ease-in-out_infinite] border-rose-400/16 bg-rose-500/[0.06]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="pulse-ring h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className={clsx("rounded-full px-3 py-1 text-[11px] font-semibold", severityTone(alert.severity))}>
                  {alert.severity}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200">{alert.description}</p>
              </div>
            </div>
            <span className="rounded-full bg-white/7 px-3 py-1 text-[11px] font-medium text-slate-200">{alert.time}</span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <AgentPill agent={alert.agent} />
            <span className="text-xs uppercase tracking-[0.16em] text-rose-100/75">{alert.tag}</span>
          </div>
        </Panel>
      ))}
    </div>
  );
}

function PatientTable({
  rows,
  selectedPatientId,
  onSelect
}: {
  rows: PatientRecord[];
  selectedPatientId: string;
  onSelect: (patientId: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/8">
      <div className="grid grid-cols-[1.5fr_0.7fr_0.9fr_0.8fr_0.9fr_1.4fr] gap-3 border-b border-white/8 bg-white/[0.04] px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-400">
        <span>Patient</span>
        <span>Age</span>
        <span>Status</span>
        <span>Risk</span>
        <span>Updated</span>
        <span>Assigned Insight</span>
      </div>
      <div className="divide-y divide-white/8">
        {rows.map((row) => {
          const selected = row.id === selectedPatientId;
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => startTransition(() => onSelect(row.id))}
              className={clsx(
                "grid w-full grid-cols-[1.5fr_0.7fr_0.9fr_0.8fr_0.9fr_1.4fr] gap-3 px-4 py-4 text-left transition hover:bg-white/[0.05]",
                selected ? "bg-cyan-400/[0.09]" : ""
              )}
            >
              <div>
                <div className="font-medium text-white">
                  {row.firstName} {row.lastName}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {row.mrn} • {row.ward}
                </div>
              </div>
              <div className="text-sm text-slate-300">{row.age}</div>
              <div>
                <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", statusTone(row.status))}>{row.status}</span>
              </div>
              <div className="text-sm font-semibold text-white">{row.riskScore}%</div>
              <div className="text-sm text-slate-300">{row.lastUpdated}</div>
              <div className="space-y-1">
                <AgentPill agent={row.assignedAgent} />
                <div className="text-xs text-slate-400">{row.summary}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InsightGrid({ items }: { items: InsightCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Panel
          key={item.id}
          className={clsx(
            "before:absolute before:inset-x-5 before:top-0 before:h-1 before:rounded-b-full before:content-['']",
            insightTone(item.accent)
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.type}</div>
              <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
            </div>
            <span className="rounded-full bg-white/7 px-3 py-1 text-xs font-medium text-slate-200">
              {formatConfidence(item.confidence)}
            </span>
          </div>
          <p className="mt-3 text-sm font-medium text-slate-200">{item.summary}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{item.explanation}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <AgentPill agent={item.agent} />
            <span className="text-xs uppercase tracking-[0.16em] text-slate-500">WHY surfaced</span>
          </div>
        </Panel>
      ))}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  values,
  stroke,
  fill,
  meta
}: {
  title: string;
  subtitle: string;
  values: number[];
  stroke: string;
  fill: string;
  meta: string;
}) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="mt-1 text-sm text-slate-400">{subtitle}</div>
        </div>
        <span className="rounded-full bg-white/7 px-3 py-1 text-xs font-medium text-slate-200">{meta}</span>
      </div>
      <div className="mt-6 h-36">
        <Sparkline values={values} stroke={stroke} fill={fill} />
      </div>
    </Panel>
  );
}

function FactorBars({
  title,
  factors,
  accent
}: {
  title: string;
  factors: Array<{ label: string; value: number }>;
  accent: string;
}) {
  return (
    <Panel>
      <div className="text-sm font-medium text-white">{title}</div>
      <div className="mt-5 space-y-4">
        {factors.map((factor) => (
          <div key={factor.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-300">{factor.label}</span>
              <span className="font-medium text-white">{factor.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/8">
              <div className={clsx("h-2 rounded-full", accent)} style={{ width: `${factor.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ChatComposer({
  messages,
  draft,
  onDraftChange,
  onSend
}: {
  messages: ChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <Panel className="h-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-white">AI Chat Assistant</div>
          <div className="mt-1 text-sm text-slate-400">Natural language routing across Doctor, Nurse, Drug, and Admin agents.</div>
        </div>
        <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-xs font-medium text-emerald-100">Multi-agent online</span>
      </div>

      <div className="mt-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={clsx("max-w-[88%] rounded-[24px] px-4 py-3", message.role === "user" ? "ml-auto bg-cyan-400/14 text-cyan-50" : "bg-white/[0.06] text-slate-100")}>
            {message.agent ? <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">{message.agent}</div> : null}
            <div className="text-sm leading-6">{message.body}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <Textarea
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          className="min-h-[120px] rounded-[24px] border-white/8 bg-slate-950/70 px-4 py-3 text-slate-100 focus:ring-cyan-300/30"
          placeholder="Ask: Why is patient critical? Show lab abnormalities. Explain drug conflict."
        />
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.slice(0, 3).map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onDraftChange(prompt)}
              className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={onSend} className="rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">
            Send To Agent
          </Button>
        </div>
      </div>
    </Panel>
  );
}

function LogsTable({ rows }: { rows: LogItem[] }) {
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <Panel key={row.id} className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", row.level === "Critical" ? "bg-rose-500/14 text-rose-100" : row.level === "Warning" ? "bg-amber-400/12 text-amber-100" : "bg-cyan-400/12 text-cyan-100")}>
                  {row.level}
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{row.service}</span>
              </div>
              <div className="text-lg font-medium text-white">{row.summary}</div>
              <div className="text-sm leading-6 text-slate-400">{row.detail}</div>
            </div>
            <div className="text-sm text-slate-400">{row.at}</div>
          </div>
        </Panel>
      ))}
    </div>
  );
}

function ModelCards({ items }: { items: ModelRegistryItem[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((model) => (
        <Panel key={model.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-white">{model.name}</div>
              <div className="mt-1 text-sm text-slate-400">{model.purpose}</div>
            </div>
            <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", statusForModel(model.status))}>
              {model.status}
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MiniMetric label="Version" value={model.version} note={`Owner: ${model.owner}`} />
            <MiniMetric label="Accuracy" value={model.accuracy} note={`Drift: ${model.drift}`} />
          </div>
        </Panel>
      ))}
    </div>
  );
}

export function HospitalAiWorkbench({ slug }: WorkbenchProps) {
  const pathname = usePathname();
  const meta = pageMeta[slug];
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [token] = useState(() => tokenStore.get());
  const liveStream = useAlertsStream({ token });
  const mockStream = useMockVitalsSimulation({ enabled: !token, patients: streamPatients, intervalMs: 2200, maxItems: 80 });
  const streamState = token ? liveStream : mockStream;
  const [patientQuery, setPatientQuery] = useState("");
  const deferredPatientQuery = useDeferredValue(patientQuery);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id ?? "");
  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) ?? patients[0],
    [selectedPatientId]
  );
  const [messages, setMessages] = useState<ChatMessage[]>(chatSeed);
  const [draft, setDraft] = useState("Why is patient critical?");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredPatients = useMemo(() => {
    const query = deferredPatientQuery.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter((patient) =>
      `${patient.firstName} ${patient.lastName} ${patient.mrn} ${patient.ward}`.toLowerCase().includes(query)
    );
  }, [deferredPatientQuery]);

  const liveAlerts = useMemo(() => mapLiveAlerts(streamState.items as StreamEvent[]), [streamState.items]);
  const surfacedAlerts = useMemo(() => [...liveAlerts, ...criticalAlerts].slice(0, 6), [liveAlerts]);

  const runtimeMetrics = useMemo<MetricCard[]>(() => {
    const criticalCount = patients.filter((patient) => patient.status === "Critical").length;
    const avgHeartRate = Math.round(
      patients.reduce((sum, patient) => sum + patient.vitals.heartRateBpm, 0) / patients.length
    );

    return metricCards.map((item) => {
      if (item.id === "critical") return { ...item, value: `${criticalCount}` };
      if (item.id === "hr") return { ...item, value: `${avgHeartRate} bpm` };
      if (item.id === "alerts") return { ...item, value: `${surfacedAlerts.length + 21}` };
      return item;
    });
  }, [surfacedAlerts.length]);

  function sendMessage() {
    if (!draft.trim() || !selectedPatient) return;

    const prompt = draft.trim();
    const reply = agentReply(prompt, selectedPatient);

    setMessages((current) => [
      ...current,
      { id: `user-${current.length + 1}`, role: "user", body: prompt },
      { id: `assistant-${current.length + 2}`, role: "assistant", agent: reply.agent, body: reply.body }
    ]);
    setDraft("");
  }

  const navigationGroups = groupNavigation();

  return (
    <div className="min-h-screen bg-[#07111e] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_22%),linear-gradient(180deg,#07111e_0%,#091525_60%,#08111d_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:80px_80px]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-5 px-4 py-4 xl:px-6">
        <aside className="hidden w-[300px] shrink-0 xl:block">
          <div className="sticky top-4 rounded-[32px] border border-white/8 bg-slate-950/75 p-5 shadow-[0_18px_70px_rgba(2,8,23,0.45)] backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-[22px] bg-gradient-to-br from-emerald-300 to-cyan-400 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.25)]">
                <span className="text-lg font-bold">AI</span>
              </div>
              <div>
                <div className="text-lg font-semibold text-white">Hospital OS</div>
                <div className="mt-1 text-sm text-slate-400">Doctor, Nurse, Drug, Admin decision mesh</div>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">System state</div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {streamState.connected ? "Live telemetry connected" : "Mock live simulation active"}
                  </div>
                </div>
                <span className={clsx("h-3 w-3 rounded-full", streamState.connected ? "bg-emerald-400" : "bg-amber-300")} />
              </div>
              <div className="mt-3 text-sm leading-6 text-slate-400">
                {streamState.connected
                  ? "Real-time alerts are streaming into the dashboard."
                  : "Using animated clinical simulation so the UI still feels alive without a token."}
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {navigationGroups.map((group) => (
                <div key={group.label}>
                  <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {group.label}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const active = pathname === `/${item.slug}`;
                      return (
                        <Link
                          key={item.slug}
                          href={`/${item.slug}`}
                          className={clsx(
                            "group flex items-center justify-between rounded-[20px] px-3 py-3 text-sm transition",
                            active
                              ? "bg-cyan-400/14 text-white shadow-[inset_0_0_0_1px_rgba(103,232,249,0.16)]"
                              : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span className={clsx("grid h-10 w-10 place-items-center rounded-2xl", active ? "bg-cyan-400/14 text-cyan-100" : "bg-white/[0.04] text-slate-400 group-hover:text-slate-200")}>
                              <Icon name={item.icon} className="h-5 w-5" />
                            </span>
                            <span>{item.label}</span>
                          </span>
                          {item.liveBadge ? (
                            <span className="rounded-full bg-rose-500/14 px-3 py-1 text-[10px] font-semibold text-rose-100">
                              {item.liveBadge}
                            </span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="sticky top-4 z-20 rounded-[30px] border border-white/8 bg-slate-950/75 p-4 shadow-[0_16px_60px_rgba(2,8,23,0.42)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileNavOpen((open) => !open)}
                  className="grid h-12 w-12 place-items-center rounded-[18px] border border-white/8 bg-white/[0.04] xl:hidden"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </button>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200/70">{meta.eyebrow}</div>
                  <h1 className="mt-2 text-3xl font-semibold text-white">Hello, Doctor</h1>
                  <p className="mt-1 text-sm text-slate-400">{meta.description}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  value={patientQuery}
                  onChange={(event) => setPatientQuery(event.target.value)}
                  placeholder="Search patients, rooms, or MRN"
                  className="h-12 min-w-[260px] rounded-full border-white/8 bg-white/[0.04] px-5 text-slate-100 placeholder:text-slate-500 focus:ring-cyan-300/30"
                />
                <button type="button" className="relative grid h-12 w-12 place-items-center rounded-full border border-white/8 bg-white/[0.04]">
                  <svg className="h-5 w-5 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                  </svg>
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {surfacedAlerts.length}
                  </span>
                </button>
                <div className="flex items-center gap-3 rounded-full border border-white/8 bg-white/[0.04] px-3 py-2">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300 text-sm font-semibold text-slate-950">
                    DR
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Dr. Rao</div>
                    <div className="text-xs text-slate-400">{now.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" })}</div>
                  </div>
                </div>
              </div>
            </div>

            {mobileNavOpen ? (
              <div className="mt-4 grid gap-2 rounded-[24px] border border-white/8 bg-black/10 p-3 xl:hidden">
                {navigationItems.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${item.slug}`}
                    className={clsx(
                      "flex items-center justify-between rounded-[18px] px-3 py-3 text-sm",
                      pathname === `/${item.slug}` ? "bg-cyan-400/14 text-white" : "bg-white/[0.03] text-slate-300"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon name={item.icon} className="h-5 w-5" />
                      {item.label}
                    </span>
                    {item.liveBadge ? <span className="rounded-full bg-rose-500/14 px-3 py-1 text-[10px] font-semibold text-rose-100">{item.liveBadge}</span> : null}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-5 space-y-5 pb-24">
            {renderPage({
              slug,
              meta,
              surfacedAlerts,
              filteredPatients,
              selectedPatient,
              selectedPatientId,
              runtimeMetrics,
              messages,
              draft,
              onDraftChange: setDraft,
              onSend: sendMessage,
              onSelectPatient: setSelectedPatientId
            })}
          </div>
        </main>
      </div>

      <Link
        href="/chat-assistant"
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_45px_rgba(34,211,238,0.22)] transition hover:bg-cyan-300"
      >
        <Icon name="chat" className="h-4 w-4" />
        Chat Assistant
      </Link>
    </div>
  );
}

function renderPage({
  slug,
  meta,
  surfacedAlerts,
  filteredPatients,
  selectedPatient,
  selectedPatientId,
  runtimeMetrics,
  messages,
  draft,
  onDraftChange,
  onSend,
  onSelectPatient
}: {
  slug: PageSlug;
  meta: (typeof pageMeta)[PageSlug];
  surfacedAlerts: IntelligenceAlert[];
  filteredPatients: PatientRecord[];
  selectedPatient: PatientRecord;
  selectedPatientId: string;
  runtimeMetrics: MetricCard[];
  messages: ChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onSelectPatient: (patientId: string) => void;
}) {
  switch (slug) {
    case "dashboard":
      return (
        <>
          <Panel className="overflow-hidden">
            <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
              <div className="rounded-[24px] bg-gradient-to-br from-cyan-400/12 via-white/[0.04] to-emerald-400/10 p-5">
                <SectionHeading
                  eyebrow={meta.emphasis}
                  title={`Priority patient: ${selectedPatient.firstName} ${selectedPatient.lastName}`}
                  description={selectedPatient.summary}
                />
                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <MiniMetric label="Heart Rate" value={`${selectedPatient.vitals.heartRateBpm} bpm`} note="Live bedside" />
                  <MiniMetric label="SpO2" value={`${selectedPatient.vitals.spo2Pct}%`} note="Falling trend" />
                  <MiniMetric label="Blood Pressure" value={`${selectedPatient.vitals.systolicMmHg}/${selectedPatient.vitals.diastolicMmHg}`} note="Hemodynamic watch" />
                  <MiniMetric label="AI Decision" value={`${selectedPatient.riskScore}%`} note={selectedPatient.assignedAgent} />
                </div>
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <ChartCard
                    title="Risk Prediction"
                    subtitle={`${selectedPatient.model} • top factors now drive higher urgency`}
                    values={selectedPatient.trends.risk}
                    stroke="#34d399"
                    fill="rgba(52,211,153,0.14)"
                    meta="Sepsis / deterioration"
                  />
                  <ChartCard
                    title="Vitals Trend"
                    subtitle="Heart-rate trajectory over the last monitoring window"
                    values={selectedPatient.trends.heartRate}
                    stroke="#67e8f9"
                    fill="rgba(103,232,249,0.12)"
                    meta="Telemetry stream"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Panel>
                  <div className="text-sm font-medium text-white">Patient Monitoring Timeline</div>
                  <div className="mt-5 space-y-4">
                    {selectedPatient.timeline.map((item) => (
                      <div key={item} className="flex gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                        <div className="text-sm leading-6 text-slate-300">{item}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <ChatComposer messages={messages.slice(-3)} draft={draft} onDraftChange={onDraftChange} onSend={onSend} />
              </div>
            </div>
          </Panel>

          <MetricGrid items={runtimeMetrics} />

          <Panel>
            <SectionHeading
              eyebrow="Live critical alerts"
              title="Real-time alert strip"
              description="Soft red cards still feel urgent, but the hierarchy stays calm enough for fast scanning."
            />
            <div className="mt-5">
              <AlertCarousel alerts={surfacedAlerts} />
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Panel>
              <SectionHeading
                eyebrow="Patient overview"
                title="AI-prioritized patient table"
                description="Click any row to update the focus patient and show the assigned agent decision."
              />
              <div className="mt-5">
                <PatientTable rows={filteredPatients} selectedPatientId={selectedPatientId} onSelect={onSelectPatient} />
              </div>
            </Panel>
            <Panel>
              <SectionHeading
                eyebrow="Agent decision"
                title={selectedPatient.diagnosis}
                description={selectedPatient.reason}
                action={<AgentPill agent={selectedPatient.assignedAgent} />}
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <MiniMetric label="Confidence" value={formatConfidence(selectedPatient.confidence)} note={selectedPatient.model} />
                <MiniMetric label="Status" value={selectedPatient.status} note={`Room ${selectedPatient.room}`} />
              </div>
              <div className="mt-5 space-y-3">
                {selectedPatient.medications.map((medication) => (
                  <div key={medication} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <span className="text-sm text-white">{medication}</span>
                    <span className="text-xs text-slate-400">Active medication</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <Panel>
            <SectionHeading
              eyebrow="Explainable cards"
              title="AI insight grid"
              description="Every card states what happened, why it surfaced, and which agent should be trusted for the next action."
            />
            <div className="mt-5">
              <InsightGrid items={insightCards} />
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-3">
            <ChartCard
              title="Risk Prediction Graph"
              subtitle="System-level deterioration probability"
              values={predictionSeries.risk}
              stroke="#38bdf8"
              fill="rgba(56,189,248,0.12)"
              meta="Doctor Agent"
            />
            <ChartCard
              title="Hospital Load Graph"
              subtitle="Operational load across the current shift"
              values={predictionSeries.hospitalLoad}
              stroke="#a78bfa"
              fill="rgba(167,139,250,0.12)"
              meta="Admin Agent"
            />
            <ChartCard
              title="Drug Interaction Frequency"
              subtitle="Safety signal trend this week"
              values={predictionSeries.drugInteractions}
              stroke="#f59e0b"
              fill="rgba(245,158,11,0.12)"
              meta="Drug Agent"
            />
          </div>
        </>
      );

    case "patients":
      return (
        <>
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <Panel>
              <SectionHeading
                eyebrow={meta.emphasis}
                title="Patient cohort navigator"
                description="Search, prioritize, and move between patient contexts without losing the assigned AI recommendation."
              />
              <div className="mt-6 space-y-3">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => startTransition(() => onSelectPatient(patient.id))}
                    className={clsx(
                      "w-full rounded-[22px] border px-4 py-4 text-left transition",
                      patient.id === selectedPatientId ? "border-cyan-300/25 bg-cyan-400/[0.08]" : "border-white/8 bg-white/[0.03] hover:bg-white/[0.05]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-base font-medium text-white">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="mt-1 text-sm text-slate-400">
                          {patient.ward} • Room {patient.room}
                        </div>
                      </div>
                      <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", statusTone(patient.status))}>{patient.status}</span>
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-300">{patient.summary}</div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <AgentPill agent={patient.assignedAgent} />
                      <span className="text-sm font-semibold text-white">{patient.riskScore}% risk</span>
                    </div>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel>
              <SectionHeading
                eyebrow="Selected patient"
                title={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                description={selectedPatient.summary}
                action={<AgentPill agent={selectedPatient.assignedAgent} />}
              />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <MiniMetric label="Diagnosis" value={selectedPatient.diagnosis} note={selectedPatient.model} />
                <MiniMetric label="WHY" value={`${selectedPatient.riskScore}% risk`} note={selectedPatient.reason} />
                <MiniMetric label="Medications" value={`${selectedPatient.medications.length}`} note={selectedPatient.medications.join(", ")} />
                <MiniMetric label="Allergies" value={selectedPatient.allergies.join(", ")} note="Drug Agent cross-checking" />
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <ChartCard
                  title="SpO2 trend"
                  subtitle="Oxygen stability over the latest monitoring window"
                  values={selectedPatient.trends.spo2}
                  stroke="#34d399"
                  fill="rgba(52,211,153,0.12)"
                  meta="Nurse Agent"
                />
                <FactorBars
                  title="Top contributing factors"
                  factors={[
                    { label: "Vital instability", value: Math.min(selectedPatient.riskScore, 92) },
                    { label: "Clinical notes", value: Math.round(selectedPatient.confidence * 100) },
                    { label: "Medication context", value: selectedPatient.assignedAgent === "Drug Agent" ? 81 : 56 }
                  ]}
                  accent="bg-cyan-400"
                />
              </div>
            </Panel>
          </div>

          <Panel>
            <SectionHeading
              eyebrow="Dedicated patient page"
              title="Unified overview table"
              description="The cohort table stays available here, but the supporting detail view above is unique to the Patients module."
            />
            <div className="mt-5">
              <PatientTable rows={filteredPatients} selectedPatientId={selectedPatientId} onSelect={onSelectPatient} />
            </div>
          </Panel>
        </>
      );

    case "alerts":
      return (
        <>
          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <Panel>
              <SectionHeading
                eyebrow={meta.emphasis}
                title="Escalation queue"
                description="Grouped by urgency so teams can see what must be acted on immediately."
              />
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {["Critical", "High", "Medium"].map((severity) => (
                  <div key={severity} className="rounded-[24px] border border-white/8 bg-black/10 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm font-medium text-white">{severity}</div>
                      <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", severityTone(severity as IntelligenceAlert["severity"]))}>
                        {surfacedAlerts.filter((alert) => alert.severity === severity).length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {surfacedAlerts
                        .filter((alert) => alert.severity === severity)
                        .map((alert) => (
                          <div key={alert.id} className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
                            <div className="text-sm font-medium text-white">{alert.title}</div>
                            <div className="mt-2 text-sm leading-6 text-slate-400">{alert.description}</div>
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <AgentPill agent={alert.agent} />
                              <span className="text-xs text-slate-500">{alert.time}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel>
              <SectionHeading
                eyebrow="Response protocol"
                title="SLA and action guidance"
                description="Every active alert includes a soft recommendation rather than just a red badge."
              />
              <div className="mt-6 space-y-3">
                <MiniMetric label="Median acknowledgment" value="1m 42s" note="Improved from 2m 31s yesterday" />
                <MiniMetric label="Open bedside actions" value="7" note="Nurse Agent owns 4 of them" />
                <MiniMetric label="Escalated to ICU" value="3" note="Admin Agent reserved beds for two transfers" />
              </div>
            </Panel>
          </div>

          <Panel>
            <SectionHeading
              eyebrow="Live strip"
              title="Critical alert cards"
              description="The alerts here reuse the same live intelligence layer, but the page organizes them for triage rather than overview."
            />
            <div className="mt-5">
              <AlertCarousel alerts={surfacedAlerts} />
            </div>
          </Panel>

          <LogsTable rows={logs} />
        </>
      );

    case "ai-insights":
      return (
        <>
          <Panel>
            <SectionHeading
              eyebrow={meta.emphasis}
              title="Explainable AI cards"
              description="These are the product signature: concise AI decisions with confidence, source agent, and short reasoning."
            />
            <div className="mt-5">
              <InsightGrid items={insightCards} />
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <FactorBars
              title="Diagnosis factors for current critical case"
              factors={[
                { label: "Fever and inflammation", value: 88 },
                { label: "Oxygen decline", value: 84 },
                { label: "Hypotension pattern", value: 78 },
                { label: "Nursing note urgency", value: 66 }
              ]}
              accent="bg-rose-400"
            />
            <Panel>
              <SectionHeading
                eyebrow="Evidence chain"
                title="How the model reached the recommendation"
                description="Designed so a doctor can understand the decision in seconds."
              />
              <div className="mt-6 space-y-4">
                {[
                  "Patient vitals stream shows a sustained SpO2 drop and persistent tachycardia.",
                  "Latest CBC indicates elevated WBC and inflammatory pattern.",
                  "Clinical note mentions worsening productive cough and fatigue.",
                  "Drug Agent raised an allergy-related antibiotic concern that narrows the next-best treatment path."
                ].map((point) => (
                  <div key={point} className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-slate-300">
                    {point}
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </>
      );

    case "chat-assistant":
      return (
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <ChatComposer messages={messages} draft={draft} onDraftChange={onDraftChange} onSend={onSend} />
          <div className="space-y-5">
            <Panel>
              <SectionHeading
                eyebrow={meta.emphasis}
                title="Agent routing"
                description="The assistant routes to the right specialist instead of giving one generic answer."
              />
              <div className="mt-5 space-y-3">
                {[
                  { label: "Diagnosis", agent: "Doctor Agent", detail: "Risk, differential, recommendations" },
                  { label: "Vitals", agent: "Nurse Agent", detail: "Monitoring, bedside actions, queue status" },
                  { label: "Drug", agent: "Drug Agent", detail: "Interactions, allergies, dosage checks" },
                  { label: "Workflow", agent: "Admin Agent", detail: "Beds, staff load, hospital status" }
                ].map((route) => (
                  <div key={route.label} className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-white">{route.label}</div>
                      <AgentPill agent={route.agent as AgentName} />
                    </div>
                    <div className="mt-2 text-sm text-slate-400">{route.detail}</div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel>
              <SectionHeading
                eyebrow="Suggested prompts"
                title="Fast question starters"
                description="Designed for doctors and staff who need clarity in one tap."
              />
              <div className="mt-5 flex flex-wrap gap-2">
                {promptSuggestions.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => onDraftChange(prompt)}
                    className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      );

    case "doctor-agent":
      return (
        <>
          <Panel>
            <SectionHeading
              eyebrow={meta.emphasis}
              title="Diagnosis reasoning board"
              description="This module focuses on what the Doctor Agent believes, why it believes it, and what should happen next."
            />
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {doctorDecisions.map((decision) => (
                <div key={decision.patient} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-lg font-medium text-white">{decision.patient}</div>
                    <span className="rounded-full bg-cyan-400/12 px-3 py-1 text-xs font-medium text-cyan-100">{decision.confidence}</span>
                  </div>
                  <div className="mt-3 text-base font-medium text-slate-100">{decision.diagnosis}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-400">Why: {decision.why}</div>
                  <div className="mt-4 rounded-2xl bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50">{decision.action}</div>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <FactorBars
              title="Top contributing features"
              factors={[
                { label: "Inflammatory markers", value: 88 },
                { label: "Respiratory distress", value: 81 },
                { label: "Blood pressure decline", value: 74 },
                { label: "Care team notes", value: 65 }
              ]}
              accent="bg-cyan-400"
            />
            <ChartCard
              title="Doctor Agent confidence trend"
              subtitle="Model confidence becomes more decisive as new evidence arrives"
              values={predictionSeries.risk}
              stroke="#22d3ee"
              fill="rgba(34,211,238,0.12)"
              meta="Explainable output"
            />
          </div>
        </>
      );

    case "nurse-agent":
      return (
        <>
          <Panel>
            <SectionHeading
              eyebrow={meta.emphasis}
              title="Live bedside queue"
              description="Large cards, clear signals, and immediate next actions make this page feel like a monitoring console rather than a report."
            />
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {nurseQueue.map((item) => (
                <div key={item.patient} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-medium text-white">{item.label}</div>
                    <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-xs font-medium text-emerald-100">{item.status}</span>
                  </div>
                  <div className="mt-3 text-sm text-slate-200">{item.patient}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-400">{item.note}</div>
                  <div className="mt-4">
                    <AgentPill agent={item.agent as AgentName} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <ChartCard
              title="Vitals trend stream"
              subtitle="Heart-rate movement for the current selected patient"
              values={selectedPatient.trends.heartRate}
              stroke="#34d399"
              fill="rgba(52,211,153,0.12)"
              meta="Telemetry"
            />
            <FactorBars
              title="Bedside attention priorities"
              factors={[
                { label: "Oxygen instability", value: 82 },
                { label: "Pressure drift", value: 77 },
                { label: "Alarm repetition", value: 63 },
                { label: "Staff availability", value: 54 }
              ]}
              accent="bg-emerald-400"
            />
          </div>
        </>
      );

    case "drug-agent":
      return (
        <>
          <Panel>
            <SectionHeading
              eyebrow={meta.emphasis}
              title="Medication conflict board"
              description="This module is built around safety rules, not generic analytics."
            />
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {drugMatrix.map((item) => (
                <div key={item.pair} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-medium text-white">{item.pair}</div>
                    <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", item.severity === "Critical" ? "bg-rose-500/14 text-rose-100" : item.severity === "High" ? "bg-amber-400/12 text-amber-100" : "bg-cyan-400/12 text-cyan-100")}>
                      {item.severity}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-slate-200">{item.patient}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-400">{item.why}</div>
                  <div className="mt-4 rounded-2xl bg-amber-400/10 px-4 py-3 text-sm text-amber-50">{item.action}</div>
                </div>
              ))}
            </div>
          </Panel>
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <FactorBars
              title="Safety drivers"
              factors={[
                { label: "Interaction severity", value: 89 },
                { label: "Allergy mismatch", value: 85 },
                { label: "Renal dosing risk", value: 63 },
                { label: "Polypharmacy burden", value: 57 }
              ]}
              accent="bg-amber-400"
            />
            <ChartCard
              title="Drug conflict frequency"
              subtitle="System-wide medication safety trend"
              values={predictionSeries.drugInteractions}
              stroke="#f59e0b"
              fill="rgba(245,158,11,0.12)"
              meta="Drug Agent"
            />
          </div>
        </>
      );

    case "admin-agent":
      return (
        <>
          <Panel>
            <SectionHeading
              eyebrow={meta.emphasis}
              title="Operational command deck"
              description="Designed for flow coordination, staffing pressure, and protected capacity decisions."
            />
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {adminSignals.map((signal) => (
                <div key={signal.label} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="text-sm text-slate-400">{signal.label}</div>
                  <div className="mt-2 text-3xl font-semibold text-white">{signal.value}</div>
                  <div className="mt-3 text-sm leading-6 text-slate-400">{signal.detail}</div>
                  <div className="mt-4 rounded-2xl bg-violet-400/10 px-4 py-3 text-sm text-violet-50">{signal.action}</div>
                </div>
              ))}
            </div>
          </Panel>
          <div className="grid gap-5 xl:grid-cols-2">
            <ChartCard
              title="Hospital load"
              subtitle="Shift pressure level"
              values={predictionSeries.hospitalLoad}
              stroke="#8b5cf6"
              fill="rgba(139,92,246,0.12)"
              meta="Admin forecast"
            />
            <ChartCard
              title="ICU demand forecast"
              subtitle="Projected bed need for the next decision window"
              values={predictionSeries.icuDemand}
              stroke="#22d3ee"
              fill="rgba(34,211,238,0.12)"
              meta="Capacity model"
            />
          </div>
        </>
      );

    case "predictions":
      return (
        <>
          <MetricGrid
            items={predictionBuckets.map((bucket, index) => ({
              id: `prediction-${index}`,
              label: bucket.label,
              value: bucket.value,
              delta: "Forecast",
              tone: index === 1 ? "critical" : index === 0 ? "warning" : "info",
              note: bucket.note
            }))}
          />
          <div className="grid gap-5 xl:grid-cols-3">
            <ChartCard
              title="Deterioration forecast"
              subtitle="Projected patient deterioration"
              values={predictionSeries.risk}
              stroke="#22d3ee"
              fill="rgba(34,211,238,0.12)"
              meta="Doctor Agent"
            />
            <ChartCard
              title="ICU demand"
              subtitle="Projected protected bed need"
              values={predictionSeries.icuDemand}
              stroke="#f97316"
              fill="rgba(249,115,22,0.12)"
              meta="Admin Agent"
            />
            <ChartCard
              title="Load stress"
              subtitle="Projected hospital congestion"
              values={predictionSeries.hospitalLoad}
              stroke="#a78bfa"
              fill="rgba(167,139,250,0.12)"
              meta="Cross-agent"
            />
          </div>
        </>
      );

    case "vitals-trends":
      return (
        <>
          <div className="grid gap-5 xl:grid-cols-3">
            <ChartCard
              title="Heart Rate"
              subtitle="Selected patient trend"
              values={selectedPatient.trends.heartRate}
              stroke="#22d3ee"
              fill="rgba(34,211,238,0.12)"
              meta={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
            />
            <ChartCard
              title="SpO2"
              subtitle="Selected patient trend"
              values={selectedPatient.trends.spo2}
              stroke="#34d399"
              fill="rgba(52,211,153,0.12)"
              meta="Oxygen saturation"
            />
            <ChartCard
              title="Risk"
              subtitle="Selected patient trend"
              values={selectedPatient.trends.risk}
              stroke="#f87171"
              fill="rgba(248,113,113,0.12)"
              meta="Risk movement"
            />
          </div>
          <Panel>
            <SectionHeading
              eyebrow={meta.emphasis}
              title="Monitoring insight"
              description="Nurse Agent translates raw curves into a clear explanation so trend pages stay actionable."
            />
            <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] p-5 text-sm leading-7 text-slate-300">
              {selectedPatient.firstName}'s trend suggests {selectedPatient.status.toLowerCase()} monitoring because the heart-rate curve is{" "}
              {selectedPatient.trends.heartRate[selectedPatient.trends.heartRate.length - 1] >
              selectedPatient.trends.heartRate[0]
                ? "rising"
                : "settling"}{" "}
              while SpO2 is {selectedPatient.trends.spo2[selectedPatient.trends.spo2.length - 1] < 93 ? "still unstable" : "stabilizing"}.
            </div>
          </Panel>
        </>
      );

    case "hospital-load":
      return (
        <>
          <MetricGrid items={runtimeMetrics.slice(0, 3).concat(runtimeMetrics[4], runtimeMetrics[5])} />
          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              title="Hospital occupancy"
              subtitle="Overall demand level"
              values={predictionSeries.hospitalLoad}
              stroke="#8b5cf6"
              fill="rgba(139,92,246,0.12)"
              meta="Admin Agent"
            />
            <Panel>
              <SectionHeading
                eyebrow={meta.emphasis}
                title="Load narrative"
                description="The Admin Agent summarizes the numbers into a direct operational recommendation."
              />
              <div className="mt-6 space-y-3">
                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                  ER arrivals are above baseline, ICU capacity is protected but thin, and one float nurse reassignment is recommended.
                </div>
                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                  Best intervention now: hold one bed for shock/sepsis overflow and reduce low-acuity transfers for 60 minutes.
                </div>
              </div>
            </Panel>
          </div>
        </>
      );

    case "settings":
      return (
        <div className="grid gap-5 xl:grid-cols-3">
          {settingsGroups.map((group) => (
            <Panel key={group.title}>
              <SectionHeading eyebrow={meta.emphasis} title={group.title} description="These controls are tuned for clarity and operational trust." />
              <div className="mt-6 space-y-4">
                {group.items.map((item, index) => (
                  <label key={item} className="flex items-start gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                    <input defaultChecked={index !== 2} type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-cyan-400 focus:ring-cyan-300/30" />
                    <span className="text-sm leading-6 text-slate-300">{item}</span>
                  </label>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      );

    case "logs":
      return <LogsTable rows={logs} />;

    case "model-insights":
      return (
        <>
          <ModelCards items={modelRegistry} />
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <FactorBars
              title="Drift review focus"
              factors={[
                { label: "Data shift", value: 72 },
                { label: "Label delay", value: 49 },
                { label: "Clinical workflow change", value: 68 },
                { label: "Alert precision variation", value: 58 }
              ]}
              accent="bg-violet-400"
            />
            <Panel>
              <SectionHeading
                eyebrow={meta.emphasis}
                title="Continuous learning loop"
                description="This page keeps the ML story connected to the clinical workflow rather than hidden in a technical appendix."
              />
              <div className="mt-6 space-y-4">
                {[
                  "Clinicians review flagged decisions and confirm whether the recommendation was useful.",
                  "Feedback enters the model evaluation queue with source agent, patient context, and alert outcome.",
                  "Models with drift or lower precision move to monitoring or review before promotion."
                ].map((step) => (
                  <div key={step} className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-slate-300">
                    {step}
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </>
      );
  }
}
