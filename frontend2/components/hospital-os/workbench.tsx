"use client"

import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  Brain,
  ChevronRight,
  FileText,
  FileUp,
  LayoutDashboard,
  MessageSquare,
  Pill,
  Search,
  Settings,
  ShieldAlert,
  Stethoscope,
  Users,
  Waves,
} from "lucide-react"
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  adminSignals,
  adminWorkflowBoard,
  algorithmRegistry,
  auditSummary,
  blockchainEvents,
  chatSeed,
  chatRoutingMatrix,
  clinicalNoteSignals,
  criticalAlerts,
  doctorDecisions,
  doctorDifferentials,
  drugMatrix,
  dosageRecommendations,
  insightCards,
  labAbnormalities,
  logs,
  metricCards,
  modelRegistry,
  modelFeedbackSignals,
  navigationItems,
  nurseDevices,
  nurseQueue,
  pageMeta,
  patients,
  predictionBuckets,
  predictionSignals,
  predictionSeries,
  promptSuggestions,
  securityControls,
  settingsGroups,
  testingSignals,
  interoperabilityFlows,
  wardLoadMatrix,
  type AgentName,
  type ChatMessage,
  type IntelligenceAlert,
  type InsightCard,
  type MetricCard,
  type PageSlug,
  type PatientRecord,
} from "@/lib/hospital-data"

const pageIcons = {
  dashboard: LayoutDashboard,
  reports: FileText,
  patients: Users,
  "patient-registry": BarChart3,
  alerts: AlertTriangle,
  "ai-insights": Brain,
  "chat-assistant": MessageSquare,
  "doctor-agent": Stethoscope,
  "nurse-agent": Waves,
  "drug-agent": Pill,
  "admin-agent": Bot,
  predictions: BarChart3,
  "vitals-trends": Activity,
  "hospital-load": ShieldAlert,
  settings: Settings,
  logs: ChevronRight,
  "model-insights": Brain,
} satisfies Record<PageSlug, React.ComponentType<{ className?: string }>>

function groupedNavigation() {
  return [
    { label: "Main", items: navigationItems.filter((item) => item.section === "Main") },
    { label: "Agents", items: navigationItems.filter((item) => item.section === "Agents") },
    { label: "Analytics", items: navigationItems.filter((item) => item.section === "Analytics") },
    { label: "System", items: navigationItems.filter((item) => item.section === "System") },
  ]
}

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`
}

function toneClass(tone: MetricCard["tone"]) {
  switch (tone) {
    case "critical":
      return "from-rose-500/25 to-rose-500/5"
    case "warning":
      return "from-amber-400/22 to-amber-400/5"
    case "good":
      return "from-emerald-400/22 to-emerald-400/5"
    case "info":
    default:
      return "from-cyan-400/22 to-cyan-400/5"
  }
}

function statusClass(status: PatientRecord["status"]) {
  switch (status) {
    case "Critical":
      return "bg-rose-500/15 text-rose-100 ring-1 ring-inset ring-rose-400/20"
    case "Watch":
      return "bg-amber-400/15 text-amber-100 ring-1 ring-inset ring-amber-300/20"
    case "Improving":
      return "bg-cyan-400/15 text-cyan-100 ring-1 ring-inset ring-cyan-300/20"
    case "Stable":
    default:
      return "bg-emerald-400/15 text-emerald-100 ring-1 ring-inset ring-emerald-300/20"
  }
}

function severityClass(severity: IntelligenceAlert["severity"]) {
  switch (severity) {
    case "Critical":
      return "bg-rose-500/15 text-rose-100 ring-1 ring-inset ring-rose-400/20"
    case "High":
      return "bg-amber-400/15 text-amber-100 ring-1 ring-inset ring-amber-300/20"
    case "Medium":
    default:
      return "bg-cyan-400/15 text-cyan-100 ring-1 ring-inset ring-cyan-300/20"
  }
}

function agentClass(agent: AgentName) {
  switch (agent) {
    case "Doctor Agent":
      return "bg-cyan-400/15 text-cyan-100"
    case "Nurse Agent":
      return "bg-emerald-400/15 text-emerald-100"
    case "Drug Agent":
      return "bg-amber-400/15 text-amber-100"
    case "Admin Agent":
    default:
      return "bg-violet-400/15 text-violet-100"
  }
}

function accentBar(accent: InsightCard["accent"]) {
  switch (accent) {
    case "red":
      return "bg-rose-400"
    case "emerald":
      return "bg-emerald-400"
    case "amber":
      return "bg-amber-300"
    case "violet":
      return "bg-violet-400"
    case "cyan":
    default:
      return "bg-cyan-400"
  }
}

function modelStatus(status: string) {
  if (status === "Healthy") return "bg-emerald-400/15 text-emerald-100"
  if (status === "Monitoring") return "bg-amber-400/15 text-amber-100"
  return "bg-rose-500/15 text-rose-100"
}

function Surface({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.36)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </section>
  )
}

function AgentPill({ agent }: { agent: AgentName }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-medium", agentClass(agent))}>
      {agent}
    </span>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
          {eyebrow}
        </div>
        <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
      </div>
      {action}
    </div>
  )
}

function SmallMetric({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note: string
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-slate-950/45 p-4">
      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs leading-5 text-slate-400">{note}</div>
    </div>
  )
}

function TrendCard({
  title,
  subtitle,
  color,
  data,
  dataKey,
  kind = "line",
  compact = false,
}: {
  title: string
  subtitle: string
  color: string
  data: Array<Record<string, number | string>>
  dataKey: string
  kind?: "line" | "area" | "bar"
  compact?: boolean
}) {
  return (
    <Surface>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="mt-1 text-sm text-slate-400">{subtitle}</div>
        </div>
      </div>
      <div className={cn("mt-5", compact ? "h-44" : "h-64")}>
        <ResponsiveContainer width="100%" height="100%">
          {kind === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(2, 6, 23, 0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  color: "#e2e8f0",
                }}
              />
              <Bar dataKey={dataKey} fill={color} radius={[10, 10, 0, 0]} />
            </BarChart>
          ) : kind === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(2, 6, 23, 0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  color: "#e2e8f0",
                }}
              />
              <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fill={`url(#gradient-${dataKey})`} />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(2, 6, 23, 0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  color: "#e2e8f0",
                }}
              />
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Surface>
  )
}

function factorsToData(items: number[]) {
  return items.map((value, index) => ({ label: `T${index + 1}`, value }))
}

function transformSeries(
  source: number[],
  transform: (value: number, index: number) => number,
  prefix = "T",
) {
  return source.map((value, index) => ({
    label: `${prefix}${index + 1}`,
    value: transform(value, index),
  }))
}

function SignalBars({
  title,
  subtitle,
  items,
  colorClass,
}: {
  title: string
  subtitle: string
  items: Array<{ label: string; value: number; note?: string }>
  colorClass: string
}) {
  return (
    <Surface>
      <SectionHeader eyebrow="Signal breakdown" title={title} description={subtitle} />
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-200">{item.label}</span>
              <span className="font-medium text-white">{item.value}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/8">
              <div className={cn("h-2 rounded-full", colorClass)} style={{ width: `${item.value}%` }} />
            </div>
            {item.note ? <div className="mt-2 text-xs leading-5 text-slate-500">{item.note}</div> : null}
          </div>
        ))}
      </div>
    </Surface>
  )
}

function NarrativeList({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string
  title: string
  description: string
  items: Array<{ title: string; detail: string; tag?: string }>
}) {
  return (
    <Surface>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={`${item.title}-${item.detail}`} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-medium text-white">{item.title}</div>
              {item.tag ? (
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-slate-200">
                  {item.tag}
                </span>
              ) : null}
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</div>
          </div>
        ))}
      </div>
    </Surface>
  )
}

function OpsCards({
  eyebrow,
  title,
  description,
  items,
  tone = "cyan",
}: {
  eyebrow: string
  title: string
  description: string
  items: Array<{ label: string; value: string; note: string }>
  tone?: "cyan" | "emerald" | "amber" | "violet"
}) {
  const toneClassName =
    tone === "emerald"
      ? "bg-emerald-400/10 text-emerald-50"
      : tone === "amber"
        ? "bg-amber-400/10 text-amber-50"
        : tone === "violet"
          ? "bg-violet-400/10 text-violet-50"
          : "bg-cyan-400/10 text-cyan-50"

  return (
    <Surface>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
            <div className={cn("mt-4 rounded-[18px] px-4 py-3 text-sm", toneClassName)}>{item.note}</div>
          </div>
        ))}
      </div>
    </Surface>
  )
}

type AssistantState = {
  phase: "idle" | "routing" | "thinking"
  agent?: AgentName
  route?: string
}

type SimulatedReply = {
  agent: AgentName
  route: string
  body: string
  followUps?: Array<{
    agent: AgentName
    route: string
    body: string
  }>
}

type UploadedReport = {
  id: string
  name: string
  size: string
  category: string
  status: "Processing" | "Indexed"
  patient: string
  uploadedAt: string
  summary: string
}

type DashboardMetricKey = "risk" | "heartRate" | "spo2" | "bloodPressure"

function patientLabel(patient: PatientRecord) {
  return `${patient.firstName} ${patient.lastName}`
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
  if (size >= 1024) return `${Math.round(size / 1024)} KB`
  return `${size} B`
}

function inferReportCategory(fileName: string) {
  const value = fileName.toLowerCase()
  if (value.includes("lab") || value.includes("cbc") || value.includes("blood")) return "Lab Report"
  if (value.includes("xray") || value.includes("ct") || value.includes("scan") || value.includes("mri")) {
    return "Radiology"
  }
  if (value.includes("discharge") || value.includes("summary")) return "Discharge Summary"
  if (value.includes("prescription") || value.includes("drug") || value.includes("med")) return "Medication Sheet"
  return "Clinical Document"
}

function inferReportSummary(category: string, patient: string) {
  switch (category) {
    case "Lab Report":
      return `Queued for abnormality extraction and doctor review for ${patient}.`
    case "Radiology":
      return "Marked for imaging-note linkage and diagnostic evidence extraction."
    case "Discharge Summary":
      return "Queued for longitudinal history stitching and patient summary update."
    case "Medication Sheet":
      return "Sent to Drug Agent for reconciliation and conflict screening."
    default:
      return "Sent into the hospital intelligence pipeline for indexing and agent visibility."
  }
}

function ReportUploadPanel({
  selectedPatient,
  reports,
  onUpload,
}: {
  selectedPatient: PatientRecord
  reports: UploadedReport[]
  onUpload: (files: FileList | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const patientReports = reports.filter((report) => report.patient === patientLabel(selectedPatient)).slice(0, 5)

  return (
    <Surface>
      <SectionHeader
        eyebrow="Report ingestion"
        title="Upload reports for AI indexing"
        description="Add PDFs, scans, lab exports, or summaries and route them into the Doctor, Drug, and summary pipelines."
      />
      <div className="mt-5 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-[24px] border border-dashed border-cyan-300/30 bg-cyan-400/8 p-6 text-left transition hover:border-cyan-200/50 hover:bg-cyan-400/12"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.csv"
            multiple
            className="hidden"
            onChange={(event) => {
              onUpload(event.target.files)
              event.currentTarget.value = ""
            }}
          />
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-[18px] bg-cyan-300 text-slate-950">
              <FileUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white">Drop in or select reports</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                Current patient: {patientLabel(selectedPatient)}. Accepted formats include PDF, image, DOCX, and CSV.
              </div>
              <div className="mt-4 inline-flex rounded-full bg-white/8 px-3 py-2 text-xs font-medium text-slate-200">
                AI extracts labs, notes, medication clues, and summary updates automatically
              </div>
            </div>
          </div>
        </button>
        <div className="space-y-3">
          {patientReports.length ? (
            patientReports.map((report) => (
              <div key={report.id} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-[16px] bg-white/8 text-slate-200">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{report.name}</div>
                      <div className="mt-1 text-xs text-slate-400">
                        {report.category} • {report.size} • {report.uploadedAt}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      report.status === "Indexed" ? "bg-emerald-400/15 text-emerald-100" : "bg-amber-400/15 text-amber-100",
                    )}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-400">{report.summary}</div>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-400">
              No reports uploaded yet for {patientLabel(selectedPatient)}. Upload a report to simulate extraction and agent routing.
            </div>
          )}
        </div>
      </div>
    </Surface>
  )
}

function SourceMappingPanel({
  items,
}: {
  items: Array<{
    source: string
    ingestion: string
    outputs: string[]
    agents: AgentName[]
    ui: string[]
  }>
}) {
  return (
    <Surface>
      <SectionHeader
        eyebrow="Source mapping report"
        title="How hospital data enters the system"
        description="This maps each source to ingestion path, responsible agents, and the product surfaces where the information appears."
      />
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.source} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-lg font-semibold text-white">{item.source}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">{item.ingestion}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.agents.map((agent) => (
                  <AgentPill key={`${item.source}-${agent}`} agent={agent} />
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <div className="rounded-[20px] border border-white/10 bg-slate-950/35 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">What we derive</div>
                <div className="mt-3 space-y-2">
                  {item.outputs.map((output) => (
                    <div key={output} className="text-sm leading-6 text-slate-300">
                      - {output}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-slate-950/35 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Where it shows up</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.ui.map((surface) => (
                    <span key={surface} className="rounded-full bg-white/8 px-3 py-2 text-xs font-medium text-slate-200">
                      {surface}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  )
}

function DashboardToggleChart({
  selected,
  onSelect,
  config,
}: {
  selected: DashboardMetricKey
  onSelect: (value: DashboardMetricKey) => void
  config: Record<
    DashboardMetricKey,
    {
      title: string
      subtitle: string
      color: string
      current: string
      note: string
      data: Array<Record<string, number | string>>
    }
  >
}) {
  const item = config[selected]

  return (
    <Surface className="mt-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-sm font-medium text-white">{item.title}</div>
          <div className="mt-1 text-sm text-slate-400">{item.subtitle}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["risk", "Risk"],
              ["heartRate", "Heart Rate"],
              ["spo2", "SpO2"],
              ["bloodPressure", "Blood Pressure"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={cn(
                "rounded-full px-3 py-2 text-xs font-medium transition",
                selected === key
                  ? "bg-cyan-300 text-slate-950"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/30 hover:text-white",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[0.28fr_0.72fr]">
        <div className="rounded-[22px] border border-white/10 bg-slate-950/45 p-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Selected signal</div>
          <div className="mt-2 text-3xl font-semibold text-white">{item.current}</div>
          <div className="mt-2 text-sm leading-6 text-slate-400">{item.note}</div>
        </div>
        <div className="h-64 rounded-[22px] border border-white/10 bg-white/5 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={item.data}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(2, 6, 23, 0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  color: "#e2e8f0",
                }}
              />
              <Bar dataKey="value" fill={item.color} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Surface>
  )
}

function resolvePatientFromPrompt(input: string, fallback: PatientRecord) {
  const text = input.toLowerCase()
  return (
    patients.find((patient) => {
      const full = patientLabel(patient).toLowerCase()
      return (
        text.includes(full) ||
        text.includes(patient.firstName.toLowerCase()) ||
        text.includes(patient.lastName.toLowerCase()) ||
        text.includes(patient.mrn.toLowerCase())
      )
    }) ?? fallback
  )
}

function trendDirection(values: number[]) {
  return values[values.length - 1] >= values[0] ? "rising" : "falling"
}

function bulletBlock(title: string, items: string[]) {
  return `${title}\n${items.map((item) => `- ${item}`).join("\n")}`
}

function buildAgentReply(input: string, patient: PatientRecord): SimulatedReply {
  const text = input.toLowerCase()
  const targetPatient = resolvePatientFromPrompt(input, patient)
  const targetName = patientLabel(targetPatient)
  const patientLabs = labAbnormalities.filter((item) => item.patient === targetName)
  const patientDrugIssues = drugMatrix.filter((item) => item.patient === targetName)
  const patientDecision =
    doctorDecisions.find((item) => item.patient === targetName) ??
    doctorDecisions.find((item) => item.patient.includes(targetPatient.firstName))
  const topPriorityPatients = [...patients].sort((left, right) => right.riskScore - left.riskScore).slice(0, 3)
  const loadSnapshot = adminSignals[0]
  const noteSummary = clinicalNoteSignals[0]
  const modelSummary = algorithmRegistry[1]

  if (
    text.includes("summary") ||
    text.includes("everything") ||
    text.includes("rounds") ||
    text.includes("full picture")
  ) {
    return {
      agent: "Doctor Agent",
      route: "Orchestrated patient summary",
      body: [
        bulletBlock("Clinical snapshot", [
          `${targetName} is ${targetPatient.status.toLowerCase()} with ${targetPatient.riskScore}% deterioration risk.`,
          `Leading diagnosis: ${targetPatient.diagnosis} at ${formatConfidence(targetPatient.confidence)} confidence from ${targetPatient.model}.`,
          `Main reason: ${targetPatient.reason}`,
        ]),
        bulletBlock("Next best action", [
          patientDecision?.action ?? "Repeat bedside assessment and confirm treatment bundle.",
          `Watch for ${trendDirection(targetPatient.trends.spo2)} oxygen trend and pressure instability.`,
        ]),
      ].join("\n\n"),
      followUps: [
        {
          agent: "Nurse Agent",
          route: "Monitoring route",
          body: bulletBlock("Bedside monitoring", [
            `Current vitals are HR ${targetPatient.vitals.heartRateBpm} bpm, SpO2 ${targetPatient.vitals.spo2Pct}%, BP ${targetPatient.vitals.systolicMmHg}/${targetPatient.vitals.diastolicMmHg}.`,
            `Telemetry shows ${trendDirection(targetPatient.trends.heartRate)} heart-rate stress and ${trendDirection(targetPatient.trends.spo2)} oxygen movement over the recent window.`,
          ]),
        },
        {
          agent: "Drug Agent",
          route: "Medication safety route",
          body: bulletBlock("Medication safety", [
            patientDrugIssues[0]
              ? `${patientDrugIssues[0].pair}: ${patientDrugIssues[0].action}.`
              : `No high-severity medication block is open for ${targetName}.`,
            `Allergies on record: ${targetPatient.allergies.join(", ")}.`,
          ]),
        },
      ],
    }
  }

  if (
    (text.includes("which") && text.includes("patient")) ||
    text.includes("icu attention") ||
    text.includes("who is critical")
  ) {
    return {
      agent: "Admin Agent",
      route: "Prioritization route",
      body: [
        bulletBlock(
          "Patients needing immediate attention",
          topPriorityPatients.map(
            (item) =>
              `${patientLabel(item)} • ${item.riskScore}% risk • ${item.status} • ${item.assignedAgent} is currently owning the case.`,
          ),
        ),
        bulletBlock("Operational note", [
          `ICU protected beds remain limited, so the top two risk patients should be reviewed before non-urgent transfers.`,
        ]),
      ].join("\n\n"),
      followUps: [
        {
          agent: "Doctor Agent",
          route: "Diagnosis support route",
          body: bulletBlock("Clinical recommendation", [
            `${topPriorityPatients[0] ? patientLabel(topPriorityPatients[0]) : targetName} should stay at the top of the ICU queue because the diagnostic evidence remains strongest there.`,
            `Use the explainability card and lab panel before final transfer sign-off.`,
          ]),
        },
      ],
    }
  }

  if (text.includes("drug") || text.includes("dose") || text.includes("allergy")) {
    return {
      agent: "Drug Agent" as AgentName,
      route: "Medication safety route",
      body: [
        bulletBlock("Medication safety decision", [
          `${targetName} has ${patientDrugIssues.length || 1} active medication safety concern${patientDrugIssues.length === 1 ? "" : "s"}.`,
          patientDrugIssues[0]
            ? `${patientDrugIssues[0].pair} is flagged because ${patientDrugIssues[0].why.toLowerCase()}.`
            : `${targetPatient.medications[0]} needs a manual review because the patient context is high risk.`,
        ]),
        bulletBlock("Recommended action", [
          patientDrugIssues[0]?.action ?? `Review ${targetPatient.medications[0]} before the next administration window.`,
          `Keep allergy guard active for ${targetPatient.allergies.join(", ")}.`,
        ]),
      ].join("\n\n"),
    }
  }

  if (
    text.includes("vital") ||
    text.includes("oxygen") ||
    text.includes("monitor") ||
    text.includes("spo2") ||
    text.includes("heart rate") ||
    text.includes("bp") ||
    text.includes("temperature")
  ) {
    return {
      agent: "Nurse Agent" as AgentName,
      route: "Monitoring route",
      body: [
        bulletBlock("Live vitals", [
          `${targetName} is currently HR ${targetPatient.vitals.heartRateBpm} bpm, SpO2 ${targetPatient.vitals.spo2Pct}%, BP ${targetPatient.vitals.systolicMmHg}/${targetPatient.vitals.diastolicMmHg}, Temp ${targetPatient.vitals.temperatureC}C.`,
          `Monitoring status is ${targetPatient.status.toLowerCase()} with ${trendDirection(targetPatient.trends.spo2)} oxygen and ${trendDirection(targetPatient.trends.heartRate)} heart-rate pressure.`,
        ]),
        bulletBlock("Nurse Agent action", [
          `Repeat bedside reassessment if oxygen falls below ${Math.max(88, targetPatient.vitals.spo2Pct - 2)}%.`,
          `Keep telemetry and rapid escalation path open for room ${targetPatient.room}.`,
        ]),
      ].join("\n\n"),
    }
  }

  if (
    text.includes("load") ||
    text.includes("bed") ||
    text.includes("staff") ||
    text.includes("workflow") ||
    text.includes("occupancy") ||
    text.includes("response time")
  ) {
    return {
      agent: "Admin Agent" as AgentName,
      route: "Operations route",
      body: [
        bulletBlock("Hospital load status", [
          `${loadSnapshot.label} is ${loadSnapshot.value}. ${loadSnapshot.detail}`,
          `Protected ICU capacity remains tight and response pressure is highest around emergency intake and critical transfers.`,
        ]),
        bulletBlock("Admin Agent action", [
          loadSnapshot.action,
          `Preserve one protected bed for high-risk deterioration cases over the next hour.`,
        ]),
      ].join("\n\n"),
    }
  }

  if (text.includes("lab") || text.includes("wbc") || text.includes("lactate") || text.includes("abnormal")) {
    return {
      agent: "Doctor Agent",
      route: "Lab interpretation route",
      body: [
        bulletBlock(
          "Abnormal findings",
          (patientLabs.length ? patientLabs : labAbnormalities.slice(0, 3)).map(
            (lab) => `${lab.patient} • ${lab.marker} ${lab.value} • ${lab.why}`,
          ),
        ),
        bulletBlock("Why it matters", [
          `${targetName}'s current diagnostic pathway stays elevated because the lab profile reinforces the vitals signal.`,
          `These results support the current ${targetPatient.diagnosis.toLowerCase()} pathway.`,
        ]),
      ].join("\n\n"),
    }
  }

  if (
    text.includes("note") ||
    text.includes("nlp") ||
    text.includes("bert") ||
    text.includes("clinical notes")
  ) {
    return {
      agent: "Doctor Agent",
      route: "Clinical notes route",
      body: [
        bulletBlock("Unstructured note summary", [
          noteSummary.note,
          `Clinical note support currently contributes ${clinicalNoteSignals[3]?.value ?? 68}% recommendation lift in complex cases.`,
        ]),
        bulletBlock("Doctor Agent interpretation", [
          `The note layer reinforces the same pathway as structured vitals and labs, which increases confidence in the active diagnosis.`,
          `Ambiguous phrases still need clinician confirmation before escalation is finalized.`,
        ]),
      ].join("\n\n"),
    }
  }

  if (
    text.includes("model") ||
    text.includes("prediction") ||
    text.includes("why risk") ||
    text.includes("confidence") ||
    text.includes("trust")
  ) {
    return {
      agent: "Doctor Agent",
      route: "Prediction route",
      body: [
        bulletBlock("Prediction summary", [
          `${targetName} has ${targetPatient.riskScore}% predicted deterioration risk with ${formatConfidence(targetPatient.confidence)} confidence.`,
          `${modelSummary.name} and ${targetPatient.model} are currently the most visible decision layers for this case.`,
        ]),
        bulletBlock("Why the model is leaning high", [
          targetPatient.reason,
          `Risk curve is ${trendDirection(targetPatient.trends.risk)} over the current observation window.`,
        ]),
      ].join("\n\n"),
    }
  }

  return {
    agent: "Doctor Agent" as AgentName,
    route: "Diagnosis route",
    body: [
      bulletBlock("Doctor Agent assessment", [
        `${targetName} is ${targetPatient.status.toLowerCase()} because ${targetPatient.reason.toLowerCase()}.`,
        `Leading diagnosis: ${targetPatient.diagnosis} with ${formatConfidence(targetPatient.confidence)} confidence from ${targetPatient.model}.`,
      ]),
      bulletBlock("Recommended next step", [
        patientDecision?.action ?? "Confirm the current escalation pathway and reassess after the next result update.",
        `Keep Nurse and Drug agents in the loop while the case remains high acuity.`,
      ]),
    ].join("\n\n"),
  }
}

function MetricGrid({ items }: { items: MetricCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Surface key={item.id} className={cn("bg-gradient-to-br", toneClass(item.tone))}>
          <div className="rounded-[22px] bg-slate-950/72 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-slate-200">{item.label}</div>
                <div className="mt-3 text-3xl font-semibold text-white">{item.value}</div>
              </div>
              <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-slate-200">
                {item.delta}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{item.note}</p>
          </div>
        </Surface>
      ))}
    </div>
  )
}

function PatientTable({
  rows,
  selectedId,
  onSelect,
}: {
  rows: PatientRecord[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10">
      <div className="grid grid-cols-[1.45fr_0.5fr_0.85fr_0.6fr_0.8fr_1.3fr] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
        <span>Patient</span>
        <span>Age</span>
        <span>Status</span>
        <span>Risk</span>
        <span>Updated</span>
        <span>Assigned insight</span>
      </div>
      <div className="divide-y divide-white/8">
        {rows.map((patient) => (
          <button
            key={patient.id}
            type="button"
            onClick={() => startTransition(() => onSelect(patient.id))}
            className={cn(
              "grid w-full grid-cols-[1.45fr_0.5fr_0.85fr_0.6fr_0.8fr_1.3fr] gap-3 px-4 py-4 text-left transition hover:bg-white/5",
              patient.id === selectedId && "bg-cyan-400/10",
            )}
          >
            <div>
              <div className="font-medium text-white">
                {patient.firstName} {patient.lastName}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {patient.mrn} • {patient.ward}
              </div>
            </div>
            <div className="text-sm text-slate-300">{patient.age}</div>
            <div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusClass(patient.status))}>
                {patient.status}
              </span>
            </div>
            <div className="text-sm font-semibold text-white">{patient.riskScore}%</div>
            <div className="text-sm text-slate-300">{patient.lastUpdated}</div>
            <div className="space-y-1">
              <AgentPill agent={patient.assignedAgent} />
              <div className="text-xs leading-5 text-slate-400">{patient.summary}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function InsightGrid({ items }: { items: InsightCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Surface key={item.id} className="relative overflow-hidden">
          <div className={cn("absolute inset-x-5 top-0 h-1 rounded-b-full", accentBar(item.accent))} />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{item.type}</div>
              <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
            </div>
            <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-slate-200">
              {formatConfidence(item.confidence)}
            </span>
          </div>
          <p className="mt-3 text-sm font-medium text-slate-200">{item.summary}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{item.explanation}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <AgentPill agent={item.agent} />
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">WHY surfaced</span>
          </div>
        </Surface>
      ))}
    </div>
  )
}

function ChatPanel({
  messages,
  draft,
  setDraft,
  onSend,
  onReset,
  selectedPatient,
  assistantState,
  compact = false,
}: {
  messages: ChatMessage[]
  draft: string
  setDraft: (value: string) => void
  onSend: () => void
  onReset: () => void
  selectedPatient: PatientRecord
  assistantState: AssistantState
  compact?: boolean
}) {
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = feedRef.current
    if (!node) return
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" })
  }, [messages, assistantState.phase])

  return (
    <Surface className="h-full">
      <SectionHeader
        eyebrow="Multi-agent assistant"
        title={compact ? "Live co-pilot" : "Chat interface"}
        description="Ask about diagnosis, vitals, medication safety, hospital operations, predictions, or clinical notes."
      />
      <div className={cn("mt-5 grid gap-3", compact ? "grid-cols-1" : "md:grid-cols-3")}>
        <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Active patient</div>
          <div className="mt-2 text-sm font-medium text-white">{patientLabel(selectedPatient)}</div>
          <div className="mt-1 text-xs text-slate-400">
            {selectedPatient.status} • {selectedPatient.riskScore}% risk • {selectedPatient.room}
          </div>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Assistant state</div>
          <div className="mt-2 text-sm font-medium text-white">
            {assistantState.phase === "idle"
              ? "Ready for a prompt"
              : assistantState.phase === "routing"
                ? "Routing to specialist agent"
                : "Generating simulated response"}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {assistantState.route ? `${assistantState.route} • ${assistantState.agent}` : "Multi-agent simulation active"}
          </div>
        </div>
        {!compact ? (
          <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Conversation mode</div>
            <div className="mt-2 text-sm font-medium text-white">ChatGPT-style simulation</div>
            <div className="mt-1 text-xs text-slate-400">
              Streaming replies, route-aware agents, and patient-context answers are enabled.
            </div>
          </div>
        ) : null}
      </div>
      <div ref={feedRef} className={cn("mt-5 space-y-4 overflow-y-auto pr-1", compact ? "max-h-[220px]" : "max-h-[560px]")}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[88%] rounded-[24px] px-4 py-3",
              message.role === "user" ? "ml-auto bg-cyan-400/15 text-cyan-50" : "bg-white/7 text-slate-100",
            )}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
              {message.agent ? <span>{message.agent}</span> : null}
              {message.route ? (
                <span className="rounded-full bg-white/10 px-2 py-1 normal-case tracking-normal text-slate-300">
                  {message.route}
                </span>
              ) : null}
            </div>
            <div className="whitespace-pre-wrap text-sm leading-6">{message.body}</div>
          </div>
        ))}
        {assistantState.phase !== "idle" ? (
          <div className="max-w-[88%] rounded-[24px] bg-white/7 px-4 py-3 text-slate-100">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
              <span>{assistantState.agent ?? "Hospital OS"}</span>
              {assistantState.route ? (
                <span className="rounded-full bg-white/10 px-2 py-1 normal-case tracking-normal text-slate-300">
                  {assistantState.route}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 [animation-delay:120ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 [animation-delay:240ms]" />
              <span className="ml-2">
                {assistantState.phase === "routing" ? "Selecting the best agent..." : "Building a clinical response..."}
              </span>
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-6 space-y-3">
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              onSend()
            }
          }}
          disabled={assistantState.phase !== "idle"}
          className={cn(
            "rounded-[24px] border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100",
            compact ? "min-h-[84px]" : "min-h-[120px]",
          )}
          placeholder="Ask anything: summarize the patient, show vitals, explain the model, compare ICU demand, or inspect drug safety."
        />
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.slice(0, compact ? 3 : 6).map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setDraft(prompt)}
              disabled={assistantState.phase !== "idle"}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className={cn("flex items-center gap-3", compact ? "justify-end" : "justify-between")}>
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className={cn(
              "rounded-full border border-white/10 bg-white/5 px-4 text-slate-200 hover:bg-white/10",
              compact && "hidden",
            )}
          >
            Reset chat
          </Button>
          <Button
            onClick={onSend}
            disabled={assistantState.phase !== "idle"}
            className="rounded-full bg-cyan-300 px-5 text-slate-950 hover:bg-cyan-200"
          >
            {assistantState.phase === "idle" ? "Send To Agent" : "Working..."}
          </Button>
        </div>
      </div>
    </Surface>
  )
}

function LogsView() {
  return (
    <div className="space-y-3">
      {logs.map((row) => (
        <Surface key={row.id} className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    row.level === "Critical"
                      ? "bg-rose-500/15 text-rose-100"
                      : row.level === "Warning"
                        ? "bg-amber-400/15 text-amber-100"
                        : "bg-cyan-400/15 text-cyan-100",
                  )}
                >
                  {row.level}
                </span>
                <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  {row.service}
                </span>
              </div>
              <div className="text-lg font-medium text-white">{row.summary}</div>
              <div className="text-sm leading-6 text-slate-400">{row.detail}</div>
            </div>
            <div className="text-sm text-slate-400">{row.at}</div>
          </div>
        </Surface>
      ))}
    </div>
  )
}

export function HospitalWorkbench({ slug }: { slug: PageSlug }) {
  const meta = pageMeta[slug]
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id ?? "")
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const [messages, setMessages] = useState<ChatMessage[]>(chatSeed)
  const [draft, setDraft] = useState("Why is patient critical?")
  const [assistantState, setAssistantState] = useState<AssistantState>({ phase: "idle" })
  const [dashboardMetricView, setDashboardMetricView] = useState<DashboardMetricKey>("risk")
  const [uploadedReports, setUploadedReports] = useState<UploadedReport[]>([
    {
      id: "report-seed-1",
      name: "aarav-cbc-latest.pdf",
      size: "1.2 MB",
      category: "Lab Report",
      status: "Indexed",
      patient: "Aarav Patil",
      uploadedAt: "Today, 08:18",
      summary: "CBC values were indexed into the lab abnormality timeline and doctor evidence chain.",
    },
    {
      id: "report-seed-2",
      name: "aarav-medication-reconciliation.pdf",
      size: "640 KB",
      category: "Medication Sheet",
      status: "Indexed",
      patient: "Aarav Patil",
      uploadedAt: "Today, 08:24",
      summary: "Medication sheet was routed to Drug Agent for allergy and interaction cross-checking.",
    },
  ])
  const [timeLabel, setTimeLabel] = useState("Live shift")
  const [liveIndex, setLiveIndex] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  const messageCounter = useRef(chatSeed.length + 1)
  const replyTimers = useRef<number[]>([])
  const reportTimers = useRef<number[]>([])

  useEffect(() => {
    const updateClock = () =>
      setTimeLabel(
        new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      )

    updateClock()
    const clock = window.setInterval(updateClock, 30_000)
    const live = window.setInterval(() => setLiveIndex((value) => (value + 1) % criticalAlerts.length), 3500)
    return () => {
      window.clearInterval(clock)
      window.clearInterval(live)
    }
  }, [])

  useEffect(() => {
    return () => {
      replyTimers.current.forEach((timer) => window.clearTimeout(timer))
      reportTimers.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) ?? patients[0],
    [selectedPatientId],
  )

  const filteredPatients = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()
    if (!normalized) return patients
    return patients.filter((patient) =>
      `${patient.firstName} ${patient.lastName} ${patient.mrn} ${patient.ward}`
        .toLowerCase()
        .includes(normalized),
    )
  }, [deferredQuery])

  const liveAlerts = useMemo(() => {
    return criticalAlerts.map((alert, index) => ({
      ...alert,
      time: index === liveIndex ? "Live now" : alert.time,
      title: index === liveIndex ? `${alert.title} • Updated` : alert.title,
    }))
  }, [liveIndex])

  const runtimeMetrics = useMemo(() => {
    const criticalCount = patients.filter((patient) => patient.status === "Critical").length
    const avgHeartRate = Math.round(
      patients.reduce((sum, patient) => sum + patient.vitals.heartRateBpm, 0) / patients.length,
    )
    return metricCards.map((item) => {
      if (item.id === "critical") return { ...item, value: `${criticalCount}` }
      if (item.id === "heart") return { ...item, value: `${avgHeartRate} bpm` }
      if (item.id === "alerts") return { ...item, value: `${liveAlerts.length + 23}` }
      return item
    })
  }, [liveAlerts.length])

  function nextMessageId(prefix: "u" | "a") {
    const id = `${prefix}-${messageCounter.current}`
    messageCounter.current += 1
    return id
  }

  function clearReplyTimers() {
    replyTimers.current.forEach((timer) => window.clearTimeout(timer))
    replyTimers.current = []
  }

  function handleReportUpload(files: FileList | null) {
    if (!files?.length) return
    const patientName = patientLabel(selectedPatient)
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })

    const nextReports = Array.from(files).map((file, index) => {
      const category = inferReportCategory(file.name)
      return {
        id: `report-${Date.now()}-${index}`,
        name: file.name,
        size: formatFileSize(file.size),
        category,
        status: "Processing" as const,
        patient: patientName,
        uploadedAt: `Today, ${timestamp}`,
        summary: inferReportSummary(category, patientName),
      }
    })

    setUploadedReports((current) => [...nextReports, ...current])

    nextReports.forEach((report, index) => {
      const timer = window.setTimeout(() => {
        setUploadedReports((current) =>
          current.map((item) => (item.id === report.id ? { ...item, status: "Indexed" } : item)),
        )
      }, 900 + index * 240)
      reportTimers.current.push(timer)
    })
  }

  function resetConversation() {
    clearReplyTimers()
    setAssistantState({ phase: "idle" })
    setMessages(chatSeed)
    setDraft("Why is patient critical?")
  }

  function sendMessage() {
    const prompt = draft.trim()
    if (!prompt || assistantState.phase !== "idle") return
    const reply = buildAgentReply(prompt, selectedPatient)
    clearReplyTimers()
    setMessages((current) => [...current, { id: nextMessageId("u"), role: "user", body: prompt }])
    setDraft("")
    setAssistantState({ phase: "routing", agent: reply.agent, route: reply.route })

    replyTimers.current.push(
      window.setTimeout(() => {
        setAssistantState({ phase: "thinking", agent: reply.agent, route: reply.route })
      }, 320),
    )

    replyTimers.current.push(
      window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          { id: nextMessageId("a"), role: "assistant", body: reply.body, agent: reply.agent, route: reply.route },
        ])
        if (!reply.followUps?.length) {
          setAssistantState({ phase: "idle" })
        }
      }, 980),
    )

    reply.followUps?.forEach((followUp, index) => {
      const baseDelay = 1680 + index * 880
      replyTimers.current.push(
        window.setTimeout(() => {
          setAssistantState({ phase: "thinking", agent: followUp.agent, route: followUp.route })
        }, baseDelay - 240),
      )
      replyTimers.current.push(
        window.setTimeout(() => {
          setMessages((current) => [
            ...current,
            {
              id: nextMessageId("a"),
              role: "assistant",
              body: followUp.body,
              agent: followUp.agent,
              route: followUp.route,
            },
          ])
          if (index === (reply.followUps?.length ?? 1) - 1) {
            setAssistantState({ phase: "idle" })
          }
        }, baseDelay),
      )
    })
  }

  const navGroups = groupedNavigation()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_24%),linear-gradient(180deg,#07111e_0%,#091525_60%,#08111d_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full gap-3 px-2 py-3 lg:px-3 xl:px-4">
        <aside className="hidden w-[280px] shrink-0 xl:block">
          <div className="sticky top-3 rounded-[32px] border border-white/10 bg-slate-950/75 p-4 shadow-[0_22px_80px_rgba(2,6,23,0.42)] backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-[22px] bg-gradient-to-br from-emerald-300 to-cyan-300 text-slate-950 shadow-[0_16px_40px_rgba(34,211,238,0.2)]">
                <span className="text-lg font-bold">AI</span>
              </div>
              <div>
                <div className="text-lg font-semibold text-white">Hospital OS</div>
                <div className="mt-1 text-sm text-slate-400">Doctor, Nurse, Drug, Admin mesh</div>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">System state</div>
                  <div className="mt-2 text-sm font-medium text-white">Live simulation active</div>
                </div>
                <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.6)]" />
              </div>
              <div className="mt-3 text-sm leading-6 text-slate-400">
                UI uses animated mock intelligence so alerts, charts, and agent cards still feel event-driven.
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {group.label}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = pageIcons[item.slug]
                      const active = item.slug === slug
                      return (
                        <Link
                          key={item.slug}
                          href={`/${item.slug}`}
                          className={cn(
                            "group flex items-center justify-between rounded-[20px] px-3 py-3 text-sm transition",
                            active
                              ? "bg-cyan-400/14 text-white ring-1 ring-inset ring-cyan-300/20"
                              : "text-slate-300 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={cn(
                                "grid h-10 w-10 place-items-center rounded-2xl",
                                active ? "bg-cyan-400/14 text-cyan-100" : "bg-white/5 text-slate-400",
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            <span>{item.label}</span>
                          </span>
                          {item.slug === "alerts" ? (
                            <span className="rounded-full bg-rose-500/14 px-3 py-1 text-[10px] font-semibold text-rose-100">
                              LIVE
                            </span>
                          ) : null}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="sticky top-3 z-20 rounded-[30px] border border-white/10 bg-slate-950/75 p-3 shadow-[0_18px_70px_rgba(2,6,23,0.4)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNavOpen((open) => !open)}
                  className="grid h-12 w-12 place-items-center rounded-[18px] border border-white/10 bg-white/5 xl:hidden"
                >
                  <BarChart3 className="h-5 w-5" />
                </button>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
                    {meta.eyebrow}
                  </div>
                  <h1 className="mt-2 text-3xl font-semibold text-white">Hello, Doctor</h1>
                  <p className="mt-1 text-sm text-slate-400">{meta.description}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative min-w-[260px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search patients, rooms, or MRN"
                    className="h-12 rounded-full border-white/10 bg-white/5 pl-11 text-slate-100"
                  />
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  {timeLabel}
                </div>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300 text-sm font-semibold text-slate-950">
                    DR
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Dr. Rao</div>
                    <div className="text-xs text-slate-400">Chief physician</div>
                  </div>
                </div>
              </div>
            </div>

            {navOpen ? (
              <div className="mt-4 grid gap-2 rounded-[24px] border border-white/10 bg-black/10 p-3 xl:hidden">
                {navigationItems.map((item) => {
                  const Icon = pageIcons[item.slug]
                  return (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className={cn(
                        "flex items-center justify-between rounded-[18px] px-3 py-3 text-sm",
                        item.slug === slug ? "bg-cyan-400/14 text-white" : "bg-white/5 text-slate-300",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </span>
                      {item.slug === "alerts" ? (
                        <span className="rounded-full bg-rose-500/14 px-3 py-1 text-[10px] font-semibold text-rose-100">
                          LIVE
                        </span>
                      ) : null}
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>

          <div className="mt-5 space-y-5 pb-24">
            {renderPage({
              slug,
              meta,
              metrics: runtimeMetrics,
              liveAlerts,
              selectedPatient,
              selectedPatientId,
              filteredPatients,
              messages,
              draft,
              setDraft,
              sendMessage,
              resetConversation,
              assistantState,
              dashboardMetricView,
              setDashboardMetricView,
              uploadedReports,
              handleReportUpload,
              onSelectPatient: setSelectedPatientId,
            })}
          </div>
        </main>
      </div>

      <Link
        href="/chat-assistant"
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(34,211,238,0.24)] transition hover:bg-cyan-200 xl:hidden"
      >
        <MessageSquare className="h-4 w-4" />
        Chat Assistant
      </Link>
    </div>
  )
}

function renderPage({
  slug,
  meta,
  metrics,
  liveAlerts,
  selectedPatient,
  selectedPatientId,
  filteredPatients,
  messages,
  draft,
  setDraft,
  sendMessage,
  resetConversation,
  assistantState,
  dashboardMetricView,
  setDashboardMetricView,
  uploadedReports,
  handleReportUpload,
  onSelectPatient,
}: {
  slug: PageSlug
  meta: (typeof pageMeta)[PageSlug]
  metrics: MetricCard[]
  liveAlerts: IntelligenceAlert[]
  selectedPatient: PatientRecord
  selectedPatientId: string
  filteredPatients: PatientRecord[]
  messages: ChatMessage[]
  draft: string
  setDraft: (value: string) => void
  sendMessage: () => void
  resetConversation: () => void
  assistantState: AssistantState
  dashboardMetricView: DashboardMetricKey
  setDashboardMetricView: (value: DashboardMetricKey) => void
  uploadedReports: UploadedReport[]
  handleReportUpload: (files: FileList | null) => void
  onSelectPatient: (id: string) => void
}) {
  const riskData = factorsToData(predictionSeries.risk)
  const loadData = factorsToData(predictionSeries.hospitalLoad)
  const drugData = factorsToData(predictionSeries.drugInteractions)
  const icuData = factorsToData(predictionSeries.icuDemand)
  const heartData = factorsToData(selectedPatient.trends.heartRate)
  const spo2Data = factorsToData(selectedPatient.trends.spo2)
  const patientRiskData = factorsToData(selectedPatient.trends.risk)
  const systolicData = transformSeries(selectedPatient.trends.risk, (value, index) =>
    Math.max(84, selectedPatient.vitals.systolicMmHg + 12 - index * 2 - Math.round((value - 50) / 8)),
  )
  const temperatureData = transformSeries(selectedPatient.trends.heartRate, (value, index) =>
    Number((selectedPatient.vitals.temperatureC - 0.6 + index * 0.08 + (value > 110 ? 0.2 : 0)).toFixed(1)),
  )
  const responseTimeData = [
    { label: "Triage", value: 11 },
    { label: "Agent route", value: 4 },
    { label: "Doctor review", value: 9 },
    { label: "Bed action", value: 6 },
    { label: "Medication check", value: 3 },
  ]
  const routeVolumeData = chatRoutingMatrix.map((item) => ({ label: item.route.split(" ")[0], value: item.volume }))
  const wardLoadData = wardLoadMatrix.map((item) => ({ label: item.ward.split(" ")[0], value: item.load }))
  const agentConsensusData = [
    { label: "Doctor", value: 82 },
    { label: "Nurse", value: 77 },
    { label: "Drug", value: 88 },
    { label: "Admin", value: 73 },
  ]
  const alertSeverityData = [
    { label: "Critical", value: liveAlerts.filter((item) => item.severity === "Critical").length * 12 },
    { label: "High", value: liveAlerts.filter((item) => item.severity === "High").length * 10 },
    { label: "Medium", value: Math.max(8, liveAlerts.filter((item) => item.severity === "Medium").length * 8) },
  ]
  const dashboardMetricConfig = {
    risk: {
      title: "Risk prediction",
      subtitle: "Doctor Agent confidence trend for the active patient",
      color: "#34d399",
      current: `${selectedPatient.riskScore}%`,
      note: "Shows deterioration pressure building across the current observation window.",
      data: patientRiskData,
    },
    heartRate: {
      title: "Heart-rate trajectory",
      subtitle: "Bedside telemetry summarized as a bar view",
      color: "#67e8f9",
      current: `${selectedPatient.vitals.heartRateBpm} bpm`,
      note: "Use this to quickly compare current cardiac stress against the last monitored intervals.",
      data: heartData,
    },
    spo2: {
      title: "SpO2 decline window",
      subtitle: "Oxygen stability across recent monitoring points",
      color: "#22d3ee",
      current: `${selectedPatient.vitals.spo2Pct}%`,
      note: "Lower bars indicate ongoing oxygen compromise and escalation risk.",
      data: spo2Data,
    },
    bloodPressure: {
      title: "Blood pressure movement",
      subtitle: "Hemodynamic movement summarized into one bar chart",
      color: "#a78bfa",
      current: `${selectedPatient.vitals.systolicMmHg}/${selectedPatient.vitals.diastolicMmHg}`,
      note: "Helps a doctor see pressure decline without scanning a separate mini card.",
      data: systolicData,
    },
  } satisfies Record<
    DashboardMetricKey,
    {
      title: string
      subtitle: string
      color: string
      current: string
      note: string
      data: Array<Record<string, number | string>>
    }
  >
  const dataSourceMapping = [
    {
      source: "Electronic Health Records (EHR)",
      ingestion:
        "FHIR patient sync and role-based chart access bring demographics, diagnoses, allergies, medications, and longitudinal patient history into the platform.",
      outputs: [
        "Unified patient profile and MRN-linked summary",
        "Diagnosis context for Doctor Agent reasoning",
        "Care history for dashboard, patient workspace, and chat answers",
      ],
      agents: ["Doctor Agent", "Admin Agent"] as AgentName[],
      ui: ["Dashboard", "Patients", "AI Insights", "Chat Assistant"],
    },
    {
      source: "Lab Reports",
      ingestion:
        "HL7 lab ingestion plus uploaded PDFs/CSV reports are normalized into structured abnormalities and evidence chains.",
      outputs: [
        "WBC, lactate, BNP, ANC, and abnormality flags",
        "Explainable diagnosis factors and risk score support",
        "Report indexing in the Reports module",
      ],
      agents: ["Doctor Agent", "Nurse Agent"] as AgentName[],
      ui: ["Reports", "Dashboard", "Doctor Agent", "AI Insights"],
    },
    {
      source: "Pharmacy / Medication Data",
      ingestion:
        "Medication requests, reconciliation sheets, and safety rules are cross-checked against allergies, interactions, and dosage logic.",
      outputs: [
        "Drug conflict detection and dosage recommendations",
        "Allergy-aware medication blocks",
        "Medication safety summaries for care teams",
      ],
      agents: ["Drug Agent", "Doctor Agent"] as AgentName[],
      ui: ["Reports", "Drug Agent", "Dashboard", "Chat Assistant"],
    },
    {
      source: "IoT Medical Devices",
      ingestion:
        "Event-driven device streams send heart rate, SpO2, blood pressure, and bedside monitoring signals into the live telemetry pipeline.",
      outputs: [
        "Real-time vitals trends and deterioration signals",
        "Nurse queue tasks and bedside escalation prompts",
        "Streaming alert generation for critical cases",
      ],
      agents: ["Nurse Agent", "Doctor Agent", "Admin Agent"] as AgentName[],
      ui: ["Dashboard", "Nurse Agent", "Vitals Trends", "Alerts"],
    },
  ]

  if (slug === "dashboard") {
    return (
      <>
        <Surface>
          <div className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
            <div className="rounded-[24px] bg-gradient-to-br from-cyan-400/12 via-white/5 to-emerald-400/10 p-5">
              <SectionHeader
                eyebrow={meta.emphasis}
                title={`Priority patient: ${selectedPatient.firstName} ${selectedPatient.lastName}`}
                description={selectedPatient.summary}
                action={<AgentPill agent={selectedPatient.assignedAgent} />}
              />
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <SmallMetric label="Heart Rate" value={`${selectedPatient.vitals.heartRateBpm} bpm`} note="Live bedside" />
                <SmallMetric label="SpO2" value={`${selectedPatient.vitals.spo2Pct}%`} note="Continuous pulse oximetry" />
                <SmallMetric label="Blood Pressure" value={`${selectedPatient.vitals.systolicMmHg}/${selectedPatient.vitals.diastolicMmHg}`} note="Hemodynamic watch" />
                <SmallMetric label="AI Decision" value={`${selectedPatient.riskScore}%`} note={selectedPatient.model} />
              </div>
              <DashboardToggleChart
                selected={dashboardMetricView}
                onSelect={setDashboardMetricView}
                config={dashboardMetricConfig}
              />
            </div>
            <div className="space-y-4">
              <Surface>
                <SectionHeader eyebrow="Monitoring timeline" title="Agent event log" description="Compact and readable so a doctor sees the story in seconds." />
                <div className="mt-5 space-y-4">
                  {selectedPatient.timeline.map((item) => (
                    <div key={item} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                      <div className="text-sm leading-6 text-slate-300">{item}</div>
                    </div>
                  ))}
                </div>
              </Surface>
              <ChatPanel
                messages={messages.slice(-4)}
                draft={draft}
                setDraft={setDraft}
                onSend={sendMessage}
                onReset={resetConversation}
                selectedPatient={selectedPatient}
                assistantState={assistantState}
                compact
              />
            </div>
          </div>
        </Surface>

        <MetricGrid items={metrics} />

        <OpsCards
          eyebrow="Core operating loops"
          title="Theory-to-product system blocks"
          description="Expanded from the paper's key loops: monitoring, diagnosis, medication safety, workflow coordination, and continuous learning."
          tone="violet"
          items={[
            { label: "Real-time monitoring", value: "IoT active", note: "Nurse Agent continuously interprets vitals, alarms, and bedside telemetry." },
            { label: "AI diagnosis", value: "4 models", note: "Doctor Agent uses ML outputs plus explainability factors to support clinical judgment." },
            { label: "Drug safety", value: "5 blocks", note: "Drug Agent resolves interactions, allergy conflicts, and dosage concerns before harm." },
            { label: "Workflow orchestration", value: "7 flows", note: "Admin Agent coordinates beds, staff pressure, and emergency routing." },
            { label: "Learning loop", value: "Closed", note: "Model Insights tracks feedback, drift, and retraining triggers from outcomes." },
            { label: "Unified summary", value: "1 view", note: "Dashboard pulls EHR, labs, meds, vitals, and agent decisions into one surface." },
          ]}
        />

        <Surface>
          <SectionHeader
            eyebrow="Live critical alerts"
            title="Real-time alert strip"
            description="Soft red urgency with strong hierarchy, visible source agent, and minimal cognitive noise."
          />
          <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
            {liveAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className={cn(
                  "min-w-[280px] flex-1 rounded-[24px] border border-rose-400/16 bg-rose-500/8 p-5",
                  index === 0 && "animate-[pulse-glow_2.8s_ease-in-out_infinite]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={cn("rounded-full px-3 py-1 text-[11px] font-medium", severityClass(alert.severity))}>
                      {alert.severity}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-white">{alert.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{alert.description}</p>
                  </div>
                  <span className="text-xs text-slate-300">{alert.time}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <AgentPill agent={alert.agent} />
                  <span className="text-[11px] uppercase tracking-[0.22em] text-rose-100/70">{alert.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Surface>
            <SectionHeader eyebrow="Patient overview" title="AI-prioritized patient table" description="Click any patient to update the focus context across the dashboard." />
            <div className="mt-5">
              <PatientTable rows={filteredPatients} selectedId={selectedPatientId} onSelect={onSelectPatient} />
            </div>
          </Surface>
          <Surface>
            <SectionHeader eyebrow="Assigned AI insight" title={selectedPatient.diagnosis} description={selectedPatient.reason} action={<AgentPill agent={selectedPatient.assignedAgent} />} />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <SmallMetric label="Confidence" value={formatConfidence(selectedPatient.confidence)} note={selectedPatient.model} />
              <SmallMetric label="Status" value={selectedPatient.status} note={`Room ${selectedPatient.room}`} />
            </div>
            <div className="mt-5 space-y-3">
              {selectedPatient.medications.map((medication) => (
                <div key={medication} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-white">{medication}</span>
                  <span className="text-xs text-slate-400">Active medication</span>
                </div>
              ))}
            </div>
          </Surface>
        </div>

        <Surface>
          <SectionHeader eyebrow="AI cards" title="Insight grid" description="The differentiator of the product: decisions with reason, source agent, and confidence." />
          <div className="mt-5">
            <InsightGrid items={insightCards} />
          </div>
        </Surface>

        <div className="grid gap-5 xl:grid-cols-5">
          <TrendCard title="Risk prediction graph" subtitle="System deterioration movement" color="#22d3ee" data={riskData} dataKey="value" />
          <TrendCard title="Hospital load graph" subtitle="Operational stress across the shift" color="#a78bfa" data={loadData} dataKey="value" kind="area" />
          <TrendCard title="Drug interaction frequency" subtitle="Medication safety events this week" color="#f59e0b" data={drugData} dataKey="value" kind="bar" />
          <TrendCard title="ICU demand forecast" subtitle="Protected bed demand window" color="#fb7185" data={icuData} dataKey="value" kind="area" />
          <TrendCard title="Temperature drift" subtitle="Fever trajectory in the active case" color="#34d399" data={temperatureData} dataKey="value" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <NarrativeList
            eyebrow="Clinical abnormalities"
            title="Labs and findings driving AI escalation"
            description="These evidence cards keep the dashboard aligned with your paper's explainable diagnosis and summary goals."
            items={labAbnormalities.map((item) => ({
              title: `${item.patient} • ${item.marker} ${item.value}`,
              detail: item.why,
              tag: item.status,
            }))}
          />
          <SignalBars
            title="Cross-agent confidence picture"
            subtitle="How strongly each agent is signaling the need for intervention in the active command cycle."
            colorClass="bg-cyan-400"
            items={agentConsensusData.map((item) => ({
              label: item.label,
              value: item.value,
              note: `${item.label} agent confidence in current escalation priority.`,
            }))}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <NarrativeList
            eyebrow="Interoperability fabric"
            title="FHIR, HL7, IoT, and pharmacy data exchange"
            description="The dashboard should make it obvious that this is a connected hospital intelligence layer, not a standalone UI."
            items={interoperabilityFlows.map((flow) => ({
              title: `${flow.flow} • ${flow.status}`,
              detail: `${flow.standard}: ${flow.note}`,
            }))}
          />
          <OpsCards
            eyebrow="Trust and security"
            title="Clinical safety controls"
            description="These controls translate the paper's privacy, traceability, and safe-sharing principles into visible product behavior."
            tone="emerald"
            items={securityControls.map((control) => ({
              label: control.control,
              value: control.status,
              note: control.note,
            }))}
          />
        </div>
      </>
    )
  }

  if (slug === "reports") {
    const indexedCount = uploadedReports.filter((report) => report.status === "Indexed").length
    const processingCount = uploadedReports.filter((report) => report.status === "Processing").length
    const patientScopedReports = uploadedReports.filter(
      (report) => report.patient === patientLabel(selectedPatient),
    )

    return (
      <>
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <ReportUploadPanel
            selectedPatient={selectedPatient}
            reports={uploadedReports}
            onUpload={handleReportUpload}
          />
          <Surface>
            <SectionHeader
              eyebrow={meta.emphasis}
              title="Ingestion status"
              description="Track document flow from upload to indexing so clinicians know what the AI system has already seen."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <SmallMetric label="Indexed reports" value={`${indexedCount}`} note="Available to doctor, drug, and summary pipelines" />
              <SmallMetric label="Processing queue" value={`${processingCount}`} note="Files still being parsed and classified" />
              <SmallMetric label="Active patient" value={patientLabel(selectedPatient)} note={`Room ${selectedPatient.room} • ${selectedPatient.status}`} />
              <SmallMetric label="Patient-scoped docs" value={`${patientScopedReports.length}`} note="Currently visible in the selected patient context" />
            </div>
            <div className="mt-5 rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-400">
              Uploaded reports are simulated as entering the hospital intelligence pipeline, where the Doctor Agent extracts findings,
              the Drug Agent checks medication clues, and the summary layer updates explainable patient context.
            </div>
          </Surface>
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <NarrativeList
            eyebrow="Document intelligence"
            title="What happens after upload"
            description="The upload module should feel like part of the AI operating system, not just storage."
            items={[
              {
                title: "Doctor Agent extraction",
                detail: "Lab PDFs, discharge summaries, and note bundles are parsed into evidence chains and diagnosis support surfaces.",
              },
              {
                title: "Drug Agent reconciliation",
                detail: "Medication sheets and prescription uploads trigger allergy, dosage, and interaction checks.",
              },
              {
                title: "Unified patient summary",
                detail: "Indexed documents feed the dashboard, patient workspace, and chat assistant context for the selected case.",
              },
            ]}
          />
          <NarrativeList
            eyebrow="Recent uploads"
            title="Hospital document feed"
            description="A quick log of uploaded files keeps the module operationally useful."
            items={uploadedReports.slice(0, 6).map((report) => ({
              title: `${report.patient} • ${report.name}`,
              detail: `${report.category} • ${report.summary}`,
              tag: report.status,
            }))}
          />
        </div>
        <SourceMappingPanel items={dataSourceMapping} />
      </>
    )
  }

  if (slug === "patients") {
    return (
      <>
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <Surface>
            <SectionHeader eyebrow={meta.emphasis} title="Patient cohort navigator" description="Search, prioritize, and move between patient contexts without losing the AI recommendation." />
            <div className="mt-5 space-y-3">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => startTransition(() => onSelectPatient(patient.id))}
                  className={cn(
                    "w-full rounded-[24px] border px-4 py-4 text-left transition",
                    patient.id === selectedPatientId ? "border-cyan-300/30 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/7",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-medium text-white">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        {patient.ward} • Room {patient.room}
                      </div>
                    </div>
                    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusClass(patient.status))}>
                      {patient.status}
                    </span>
                  </div>
                  <div className="mt-3 text-sm leading-6 text-slate-300">{patient.summary}</div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <AgentPill agent={patient.assignedAgent} />
                    <span className="text-sm font-semibold text-white">{patient.riskScore}% risk</span>
                  </div>
                </button>
              ))}
            </div>
          </Surface>
          <Surface>
            <SectionHeader eyebrow="Selected patient" title={`${selectedPatient.firstName} ${selectedPatient.lastName}`} description={selectedPatient.summary} action={<AgentPill agent={selectedPatient.assignedAgent} />} />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <SmallMetric label="Diagnosis" value={selectedPatient.diagnosis} note={selectedPatient.model} />
              <SmallMetric label="WHY" value={`${selectedPatient.riskScore}% risk`} note={selectedPatient.reason} />
              <SmallMetric label="Medications" value={`${selectedPatient.medications.length}`} note={selectedPatient.medications.join(", ")} />
              <SmallMetric label="Allergies" value={selectedPatient.allergies.join(", ")} note="Drug Agent cross-checking" />
            </div>
            <div className="mt-6 grid gap-4 xl:grid-cols-4">
              <TrendCard title="SpO2 trend" subtitle="Oxygen stability over the latest window" color="#34d399" data={spo2Data} dataKey="value" />
              <TrendCard title="Risk trajectory" subtitle="Predicted deterioration movement" color="#22d3ee" data={patientRiskData} dataKey="value" kind="area" />
              <TrendCard title="Heart-rate" subtitle="Telemetry movement for selected patient" color="#a78bfa" data={heartData} dataKey="value" />
              <TrendCard title="Temperature" subtitle="Clinical temperature drift" color="#fb7185" data={temperatureData} dataKey="value" />
            </div>
          </Surface>
        </div>
        <Surface>
          <SectionHeader eyebrow="Table view" title="Unified patient list" description="This page keeps the cohort interaction central instead of burying it under KPI cards." />
          <div className="mt-5">
            <PatientTable rows={filteredPatients} selectedId={selectedPatientId} onSelect={onSelectPatient} />
          </div>
        </Surface>
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <NarrativeList
            eyebrow="Patient intelligence"
            title="Care pathway notes and abnormal findings"
            description="The patient workspace now combines summary, trajectory, labs, and agent reasoning instead of just a selection list."
            items={[
              ...selectedPatient.timeline.map((item) => ({ title: selectedPatient.firstName, detail: item })),
              ...labAbnormalities.slice(0, 2).map((item) => ({
                title: `${item.marker} • ${item.value}`,
                detail: item.why,
                tag: item.status,
              })),
            ]}
          />
          <TrendCard title="Ward pressure comparison" subtitle="How the selected patient's ward sits against the hospital load picture" color="#8b5cf6" data={wardLoadData} dataKey="value" kind="bar" />
        </div>
      </>
    )
  }

  if (slug === "alerts") {
    return (
      <>
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <Surface>
            <SectionHeader eyebrow={meta.emphasis} title="Escalation queue" description="Grouped by urgency so the triage flow is obvious." />
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {(["Critical", "High", "Medium"] as const).map((severity) => (
                <div key={severity} className="rounded-[24px] border border-white/10 bg-black/10 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm font-medium text-white">{severity}</div>
                    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", severityClass(severity))}>
                      {liveAlerts.filter((alert) => alert.severity === severity).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {liveAlerts
                      .filter((alert) => alert.severity === severity)
                      .map((alert) => (
                        <div key={alert.id} className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                          <div className="text-sm font-medium text-white">{alert.title}</div>
                          <div className="mt-2 text-sm leading-6 text-slate-400">{alert.description}</div>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <AgentPill agent={alert.agent} />
                            <span className="text-xs text-slate-400">{alert.time}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Surface>
          <Surface>
            <SectionHeader eyebrow="SLA intelligence" title="Response protocol" description="Not just red cards: every alert gets operational context." />
            <div className="mt-6 space-y-3">
              <SmallMetric label="Median acknowledgment" value="1m 42s" note="Improved from 2m 31s yesterday" />
              <SmallMetric label="Open bedside actions" value="7" note="Nurse Agent owns 4 of them" />
              <SmallMetric label="Escalated to ICU" value="3" note="Admin Agent reserved beds for two transfers" />
            </div>
          </Surface>
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          <TrendCard title="Alert severity pressure" subtitle="Relative pressure by alert tier" color="#fb7185" data={alertSeverityData} dataKey="value" kind="bar" />
          <TrendCard title="Response time funnel" subtitle="Minutes consumed by each response stage" color="#22d3ee" data={responseTimeData} dataKey="value" kind="bar" />
          <OpsCards
            eyebrow="Alert operations"
            title="Response board"
            description="Built around your emergency alert and workflow coordination use cases."
            tone="amber"
            items={[
              { label: "Auto-escalated", value: "9", note: "Critical alerts automatically routed to Doctor and Nurse agents." },
              { label: "Drug holds", value: "3", note: "Medication blocks prevented unsafe administration before review." },
              { label: "Bed requests", value: "2", note: "Admin Agent opened ICU transfer workflows from alert context." },
            ]}
          />
        </div>
        <LogsView />
      </>
    )
  }

  if (slug === "ai-insights") {
    return (
      <>
        <Surface>
          <SectionHeader eyebrow={meta.emphasis} title="Explainable AI cards" description="This page is built entirely around your USP: explainable multi-agent intelligence." />
          <div className="mt-5">
            <InsightGrid items={insightCards} />
          </div>
        </Surface>
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <TrendCard title="Top factor influence" subtitle="Doctor Agent feature impact" color="#fb7185" data={[88, 84, 78, 66].map((value, index) => ({ label: `F${index + 1}`, value }))} dataKey="value" kind="bar" />
          <Surface>
            <SectionHeader eyebrow="Evidence chain" title="How the model reached the recommendation" description="Designed so a doctor can understand the answer in under five seconds." />
            <div className="mt-6 space-y-4">
              {[
                "Patient vitals stream shows a sustained SpO2 drop and persistent tachycardia.",
                "Latest CBC indicates elevated WBC and inflammatory pattern.",
                "Clinical note mentions worsening cough and fatigue.",
                "Drug Agent raised an allergy-related antibiotic concern that narrows the next-best treatment path.",
              ].map((point) => (
                <div key={point} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300">
                  {point}
                </div>
              ))}
            </div>
          </Surface>
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <SignalBars
            title="Explainability confidence lanes"
            subtitle="A richer AI Insights page should show how different evidence types influence the surfaced decision."
            colorClass="bg-violet-400"
            items={[
              { label: "Vitals evidence", value: 86, note: "IoT and bedside telemetry are currently the strongest evidence source." },
              { label: "Lab abnormalities", value: 82, note: "Inflammatory markers and lactate continue to reinforce risk." },
              { label: "Medication context", value: 69, note: "Drug safety signals are modifying the recommended next action." },
              { label: "Workflow pressure", value: 61, note: "Bed and staff constraints influence operational priority, not diagnosis." },
            ]}
          />
          <TrendCard title="Cross-agent consensus trend" subtitle="How tightly the agents agree on the current critical pathway" color="#a78bfa" data={agentConsensusData} dataKey="value" kind="bar" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <OpsCards
            eyebrow="Algorithm stack"
            title="Clinical AI methods in use"
            description="This page now reflects the methodology section of your paper, not just output cards."
            tone="violet"
            items={algorithmRegistry.map((item) => ({
              label: `${item.shorthand} • ${item.role}`,
              value: item.name,
              note: `${item.purpose}. ${item.note}`,
            }))}
          />
          <SignalBars
            title="Clinical note intelligence"
            subtitle="NLP understanding from BERT should be visible because your paper explicitly includes unstructured note analysis."
            colorClass="bg-cyan-400"
            items={clinicalNoteSignals}
          />
        </div>
      </>
    )
  }

  if (slug === "chat-assistant") {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ChatPanel
          messages={messages}
          draft={draft}
          setDraft={setDraft}
          onSend={sendMessage}
          onReset={resetConversation}
          selectedPatient={selectedPatient}
          assistantState={assistantState}
        />
        <div className="space-y-5">
          <Surface>
            <SectionHeader eyebrow={meta.emphasis} title="Agent routing" description="This assistant routes to the right specialist instead of returning one generic answer." />
            <div className="mt-5 space-y-3">
              {[
                { label: "Diagnosis", agent: "Doctor Agent", detail: "Risk, differential, recommendations" },
                { label: "Vitals", agent: "Nurse Agent", detail: "Monitoring, bedside actions, queue status" },
                { label: "Drug", agent: "Drug Agent", detail: "Interactions, allergies, dosage checks" },
                { label: "Workflow", agent: "Admin Agent", detail: "Beds, staff load, hospital status" },
              ].map((route) => (
                <div key={route.label} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-white">{route.label}</div>
                    <AgentPill agent={route.agent as AgentName} />
                  </div>
                  <div className="mt-2 text-sm text-slate-400">{route.detail}</div>
                </div>
              ))}
            </div>
          </Surface>
          <Surface>
            <SectionHeader eyebrow="Prompt starters" title="Fast question starters" description="Shortcuts for doctors and staff who need answers immediately." />
            <div className="mt-5 flex flex-wrap gap-2">
              {promptSuggestions.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setDraft(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </Surface>
        </div>
        <div className="xl:col-span-2 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <TrendCard title="Query routing distribution" subtitle="How the conversational layer splits questions across specialist agents" color="#22d3ee" data={routeVolumeData} dataKey="value" kind="bar" />
          <NarrativeList
            eyebrow="Structured response patterns"
            title="How the assistant should answer"
            description="This keeps the chatbot aligned with the paper's multi-agent interface instead of feeling like a generic LLM."
            items={[
              { title: "What happened?", detail: "Summarize the risk, signal, or workflow issue in one sentence." },
              { title: "Why did it happen?", detail: "Show top contributing factors, confidence, and the responsible agent." },
              { title: "What should happen next?", detail: "Give a clear action for the doctor, nurse, pharmacy, or admin team." },
            ]}
          />
        </div>
        <div className="xl:col-span-2 grid gap-5 xl:grid-cols-[1fr_1fr]">
          <SignalBars
            title="NLP extraction strength"
            subtitle="The assistant should feel like a clinical co-pilot that understands free-text notes, not just a command palette."
            colorClass="bg-cyan-400"
            items={clinicalNoteSignals}
          />
          <NarrativeList
            eyebrow="Data routes"
            title="How chat reaches the right hospital systems"
            description="This makes the conversational page feel like a real multi-agent interface connected to the hospital stack."
            items={interoperabilityFlows.map((flow) => ({
              title: `${flow.flow} • ${flow.standard}`,
              detail: flow.note,
              tag: flow.status,
            }))}
          />
        </div>
      </div>
    )
  }

  if (slug === "doctor-agent") {
    return (
      <>
        <Surface>
          <SectionHeader eyebrow={meta.emphasis} title="Diagnosis reasoning board" description="This page is focused on what the Doctor Agent believes, why it believes it, and what to do next." />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {doctorDecisions.map((decision) => (
              <div key={decision.patient} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-medium text-white">{decision.patient}</div>
                  <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-medium text-cyan-100">
                    {decision.confidence}
                  </span>
                </div>
                <div className="mt-3 text-base font-medium text-slate-100">{decision.diagnosis}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">Why: {decision.why}</div>
                <div className="mt-4 rounded-[18px] bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50">
                  {decision.action}
                </div>
              </div>
            ))}
          </div>
        </Surface>
        <div className="grid gap-5 xl:grid-cols-3">
          <TrendCard title="Doctor confidence trend" subtitle="Model conviction as new evidence arrives" color="#22d3ee" data={riskData} dataKey="value" />
          <TrendCard title="Predicted deterioration curve" subtitle="Severity progression forecast" color="#34d399" data={patientRiskData} dataKey="value" kind="area" />
          <TrendCard title="Clinical temperature support" subtitle="Temperature drift contributing to diagnostic confidence" color="#fb7185" data={temperatureData} dataKey="value" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <NarrativeList
            eyebrow="Differential diagnosis"
            title="Alternative pathways considered"
            description="A robust Doctor Agent view should show what else was considered, not only the final label."
            items={doctorDifferentials.flatMap((item) => [
              { title: `${item.patient} • Lead diagnosis`, detail: `${item.lead} with ${item.confidence} confidence. ${item.recommendation}` },
              ...item.alternatives.map((alt) => ({ title: `${item.patient} • Alternative`, detail: alt })),
            ])}
          />
          <SignalBars
            title="Decision factor strengths"
            subtitle="Why the Doctor Agent is favoring the current pathway."
            colorClass="bg-cyan-400"
            items={[
              { label: "Vitals deterioration", value: 89, note: "Trend movement is the strongest live diagnostic driver." },
              { label: "Lab evidence", value: 84, note: "WBC, lactate, and inflammatory markers remain clinically significant." },
              { label: "Clinical notes", value: 71, note: "Free-text symptoms reinforce the structured signal picture." },
              { label: "Drug context", value: 58, note: "Medication safety influences the recommended treatment path." },
            ]}
          />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <OpsCards
            eyebrow="Decision science"
            title="Models powering the Doctor Agent"
            description="This board ties diagnostic support directly back to the paper's SVM, RF, LR, Q-learning, and BERT methodology."
            tone="cyan"
            items={algorithmRegistry.map((item) => ({
              label: item.shorthand,
              value: item.name,
              note: `${item.purpose}. ${item.note}`,
            }))}
          />
          <SignalBars
            title="Clinical note support"
            subtitle="Unstructured symptoms and note context should be visible in the Doctor Agent because they shape the recommendation."
            colorClass="bg-violet-400"
            items={clinicalNoteSignals}
          />
        </div>
      </>
    )
  }

  if (slug === "nurse-agent") {
    return (
      <>
        <Surface>
          <SectionHeader eyebrow={meta.emphasis} title="Live bedside queue" description="Large cards and clear tasks make this page feel like a real monitoring console." />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {nurseQueue.map((item) => (
              <div key={item.patient} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-base font-medium text-white">{item.label}</div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-100">
                    {item.status}
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-200">{item.patient}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">{item.note}</div>
                <div className="mt-4">
                  <AgentPill agent="Nurse Agent" />
                </div>
              </div>
            ))}
          </div>
        </Surface>
        <div className="grid gap-5 xl:grid-cols-4">
          <TrendCard title="Heart-rate stream" subtitle="Current selected patient telemetry" color="#34d399" data={heartData} dataKey="value" />
          <TrendCard title="SpO2 stability" subtitle="Oxygen movement across the latest monitoring window" color="#22d3ee" data={spo2Data} dataKey="value" />
          <TrendCard title="Blood pressure" subtitle="Bedside hemodynamic movement" color="#a78bfa" data={systolicData} dataKey="value" />
          <TrendCard title="Temperature" subtitle="Fever tracking for nursing reassessment" color="#fb7185" data={temperatureData} dataKey="value" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <NarrativeList
            eyebrow="Device health"
            title="IoT and bedside device context"
            description="This connects directly to the paper's real-time patient monitoring loop."
            items={nurseDevices.map((item) => ({
              title: `${item.device} • ${item.patient}`,
              detail: item.note,
              tag: item.health,
            }))}
          />
          <SignalBars
            title="Escalation readiness"
            subtitle="Where the Nurse Agent is focusing attention right now."
            colorClass="bg-emerald-400"
            items={[
              { label: "Bedside urgency", value: 84, note: "Immediate reassessment need based on current alarms." },
              { label: "Signal quality", value: 72, note: "One device needs periodic manual confirmation." },
              { label: "Queue pressure", value: 67, note: "Monitoring tasks are still manageable but rising." },
              { label: "Emergency readiness", value: 79, note: "Two cases could become hard escalations quickly." },
            ]}
          />
        </div>
        <OpsCards
          eyebrow="Streaming architecture"
          title="Bedside data pipeline"
          description="The Nurse Agent should visibly sit on top of the paper's event-driven, device-connected monitoring architecture."
          tone="emerald"
          items={interoperabilityFlows.map((flow) => ({
            label: flow.flow,
            value: flow.status,
            note: flow.note,
          }))}
        />
      </>
    )
  }

  if (slug === "drug-agent") {
    return (
      <>
        <Surface>
          <SectionHeader eyebrow={meta.emphasis} title="Medication conflict board" description="This page is designed around safety rules, allergy risk, and dosage conflict handling." />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {drugMatrix.map((item) => (
              <div key={item.pair} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-base font-medium text-white">{item.pair}</div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      item.severity === "Critical"
                        ? "bg-rose-500/15 text-rose-100"
                        : item.severity === "High"
                          ? "bg-amber-400/15 text-amber-100"
                          : "bg-cyan-400/15 text-cyan-100",
                    )}
                  >
                    {item.severity}
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-200">{item.patient}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">{item.why}</div>
                <div className="mt-4 rounded-[18px] bg-amber-400/10 px-4 py-3 text-sm text-amber-50">
                  {item.action}
                </div>
              </div>
            ))}
          </div>
        </Surface>
        <div className="grid gap-5 xl:grid-cols-3">
          <TrendCard title="Drug interaction frequency" subtitle="Safety signal trend this week" color="#f59e0b" data={drugData} dataKey="value" kind="bar" />
          <TrendCard title="Dose safety pressure" subtitle="AI-estimated safety pressure by recent medication cycle" color="#fb7185" data={patientRiskData} dataKey="value" kind="area" />
          <TrendCard title="Monitoring load" subtitle="How medication risk is affecting bedside follow-up" color="#22d3ee" data={responseTimeData} dataKey="value" kind="bar" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <NarrativeList
            eyebrow="Dosage engine"
            title="Medication plan adjustments"
            description="Aligned to the paper's Drug Checker and dosage alert theory."
            items={dosageRecommendations.map((item) => ({
              title: `${item.patient} • ${item.drug}`,
              detail: `${item.action}. ${item.why}`,
            }))}
          />
          <SignalBars
            title="Safety conflict sources"
            subtitle="Why the Drug Agent is blocking or modifying the current plan."
            colorClass="bg-amber-400"
            items={[
              { label: "Interaction severity", value: 92, note: "Current overlap between active medications remains the strongest risk." },
              { label: "Allergy mismatch", value: 85, note: "Allergy-aware recommendations are active for critical patients." },
              { label: "Dose timing risk", value: 66, note: "Scheduling overlap still creates avoidable exposure." },
              { label: "Renal adjustment", value: 58, note: "Kidney-sensitive medications need closer rule-based review." },
            ]}
          />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <NarrativeList
            eyebrow="Traceability ledger"
            title="Medication actions recorded to audit trail"
            description="This page now reflects the blockchain-backed safety and traceability idea from the paper."
            items={blockchainEvents
              .filter((item) => item.actor === "Drug Agent" || item.actor === "Doctor Agent")
              .map((item) => ({
                title: `${item.actor} • ${item.event}`,
                detail: item.detail,
              }))}
          />
          <NarrativeList
            eyebrow="Medication interoperability"
            title="Shared drug data routes"
            description="Drug safety depends on pharmacy, EHR, and order synchronization staying reliable."
            items={interoperabilityFlows
              .filter((flow) => flow.flow.toLowerCase().includes("pharmacy") || flow.flow.toLowerCase().includes("fhir"))
              .map((flow) => ({
                title: `${flow.flow} • ${flow.status}`,
                detail: `${flow.standard}: ${flow.note}`,
              }))}
          />
        </div>
      </>
    )
  }

  if (slug === "admin-agent") {
    return (
      <>
        <Surface>
          <SectionHeader eyebrow={meta.emphasis} title="Operational command deck" description="Focused on capacity, staffing pressure, and resource orchestration." />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {adminSignals.map((signal) => (
              <div key={signal.label} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="text-sm text-slate-400">{signal.label}</div>
                <div className="mt-2 text-3xl font-semibold text-white">{signal.value}</div>
                <div className="mt-3 text-sm leading-6 text-slate-400">{signal.detail}</div>
                <div className="mt-4 rounded-[18px] bg-violet-400/10 px-4 py-3 text-sm text-violet-50">
                  {signal.action}
                </div>
              </div>
            ))}
          </div>
        </Surface>
        <div className="grid gap-5 xl:grid-cols-3">
          <TrendCard title="Hospital load" subtitle="Shift pressure level" color="#8b5cf6" data={loadData} dataKey="value" kind="area" />
          <TrendCard title="ICU demand forecast" subtitle="Projected protected bed need" color="#22d3ee" data={icuData} dataKey="value" />
          <TrendCard title="Ward load comparison" subtitle="Pressure by key ward" color="#fb7185" data={wardLoadData} dataKey="value" kind="bar" />
        </div>
        <OpsCards
          eyebrow="Workflow coordination"
          title="Hospital flow board"
          description="Built around the paper's admin workflow coordination and patient flow goals."
          tone="violet"
          items={adminWorkflowBoard.map((item) => ({
            label: item.lane,
            value: item.value,
            note: item.note,
          }))}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <NarrativeList
            eyebrow="Standards and routing"
            title="Hospital-wide integration map"
            description="The Admin Agent should show how staffing and bed decisions depend on synchronized hospital data."
            items={interoperabilityFlows.map((flow) => ({
              title: `${flow.flow} • ${flow.standard}`,
              detail: `${flow.note} Current state: ${flow.status}.`,
            }))}
          />
          <NarrativeList
            eyebrow="Audit and accountability"
            title="Operational trace events"
            description="Resource decisions should be explainable and reviewable, especially for emergency routing and ICU usage."
            items={blockchainEvents.map((event) => ({
              title: `${event.actor} • ${event.event}`,
              detail: event.detail,
            }))}
          />
        </div>
      </>
    )
  }

  if (slug === "predictions") {
    return (
      <>
        <MetricGrid
          items={predictionBuckets.map((bucket, index) => ({
            id: bucket.label,
            label: bucket.label,
            value: bucket.value,
            delta: "Forecast",
            tone: index === 1 ? "critical" : index === 0 ? "warning" : "info",
            note: bucket.note,
          }))}
        />
        <div className="grid gap-5 xl:grid-cols-3">
          <TrendCard title="Deterioration forecast" subtitle="Projected patient risk" color="#22d3ee" data={riskData} dataKey="value" />
          <TrendCard title="ICU demand forecast" subtitle="Protected bed need" color="#f97316" data={icuData} dataKey="value" kind="area" />
          <TrendCard title="Load stress forecast" subtitle="Projected hospital congestion" color="#a78bfa" data={loadData} dataKey="value" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <OpsCards
            eyebrow="Forecast board"
            title="Key predictive signals"
            description="These cards turn prediction outputs into signals a doctor or operator can immediately understand."
            tone="cyan"
            items={predictionSignals.map((item) => ({
              label: item.label,
              value: `${item.value}%`,
              note: item.note,
            }))}
          />
          <SignalBars
            title="Prediction confidence spread"
            subtitle="The model stack should show where it is more or less certain before clinicians act."
            colorClass="bg-cyan-400"
            items={[
              { label: "Sepsis forecast", value: 83, note: "Strongest predictive performance in the current cohort." },
              { label: "ICU demand", value: 74, note: "Operational forecasting is helpful but more variable than clinical risk." },
              { label: "Readmission", value: 67, note: "Longer-horizon signals are directionally useful." },
              { label: "Workflow strain", value: 61, note: "Dependent on staffing and bed events outside direct clinical data." },
            ]}
          />
        </div>
      </>
    )
  }

  if (slug === "vitals-trends") {
    return (
      <>
        <div className="grid gap-5 xl:grid-cols-4">
          <TrendCard title="Heart Rate" subtitle="Selected patient trend" color="#22d3ee" data={heartData} dataKey="value" />
          <TrendCard title="SpO2" subtitle="Selected patient trend" color="#34d399" data={spo2Data} dataKey="value" />
          <TrendCard title="Risk" subtitle="Selected patient trend" color="#fb7185" data={patientRiskData} dataKey="value" kind="area" />
          <TrendCard title="Systolic BP" subtitle="Selected patient trend" color="#a78bfa" data={systolicData} dataKey="value" />
        </div>
        <Surface>
          <SectionHeader eyebrow={meta.emphasis} title="Monitoring insight" description="Nurse Agent translates raw curves into a clear explanation so trends remain actionable." />
          <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
            {selectedPatient.firstName}'s monitoring trend suggests {selectedPatient.status.toLowerCase()} observation because the heart-rate curve is{" "}
            {selectedPatient.trends.heartRate[selectedPatient.trends.heartRate.length - 1] >
            selectedPatient.trends.heartRate[0]
              ? "rising"
              : "settling"}{" "}
            while SpO2 is{" "}
            {selectedPatient.trends.spo2[selectedPatient.trends.spo2.length - 1] < 93
              ? "still unstable."
              : "stabilizing."}
          </div>
        </Surface>
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <TrendCard title="Temperature curve" subtitle="Thermal pattern for reassessment windows" color="#f97316" data={temperatureData} dataKey="value" />
          <SignalBars
            title="Anomaly watchlist"
            subtitle="A trend page in an AI hospital OS should highlight likely anomaly sources, not just curves."
            colorClass="bg-emerald-400"
            items={[
              { label: "Oxygen anomaly", value: 84, note: "SpO2 instability remains the strongest nursing concern." },
              { label: "Tachycardia anomaly", value: 79, note: "Sustained elevated HR still supports close telemetry." },
              { label: "Pressure anomaly", value: 68, note: "Hemodynamic drift could change escalation priority quickly." },
              { label: "Thermal anomaly", value: 63, note: "Temperature movement still supports infection watch." },
            ]}
          />
        </div>
      </>
    )
  }

  if (slug === "hospital-load") {
    return (
      <>
        <MetricGrid items={[metrics[0], metrics[2], metrics[4], metrics[5]]} />
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <TrendCard title="Hospital occupancy" subtitle="Overall demand level" color="#8b5cf6" data={loadData} dataKey="value" kind="area" />
          <Surface>
            <SectionHeader eyebrow={meta.emphasis} title="Load narrative" description="The Admin Agent turns capacity data into a direct operational recommendation." />
            <div className="mt-6 space-y-3">
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                ER arrivals are above baseline, ICU capacity is protected but thin, and one float nurse reassignment is recommended.
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                Best intervention now: hold one bed for shock/sepsis overflow and reduce low-acuity transfers for 60 minutes.
              </div>
            </div>
          </Surface>
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          <TrendCard title="Ward load matrix" subtitle="Pressure across operational zones" color="#fb7185" data={wardLoadData} dataKey="value" kind="bar" />
          <TrendCard title="ICU capacity pressure" subtitle="Transfer and protected bed load" color="#22d3ee" data={icuData} dataKey="value" />
          <TrendCard title="Workflow latency" subtitle="Where operational minutes are being consumed" color="#34d399" data={responseTimeData} dataKey="value" kind="bar" />
        </div>
      </>
    )
  }

  if (slug === "settings") {
    return (
      <>
        <div className="grid gap-5 xl:grid-cols-3">
          {settingsGroups.map((group) => (
            <Surface key={group.title}>
              <SectionHeader eyebrow={meta.emphasis} title={group.title} description="Controls tuned for clarity, trust, and real-time operations." />
              <div className="mt-6 space-y-4">
                {group.items.map((item, index) => (
                  <label key={item} className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <input defaultChecked={index !== 2} type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-cyan-400" />
                    <span className="text-sm leading-6 text-slate-300">{item}</span>
                  </label>
                ))}
              </div>
            </Surface>
          ))}
        </div>
        <OpsCards
          eyebrow="Operating profile"
          title="Clinical preference profile"
          description="A more robust settings page should show what kind of AI operating mode the hospital is currently configured for."
          tone="emerald"
          items={[
            { label: "Decision mode", value: "Assistive", note: "AI recommendations are visible and explainable, with doctor sign-off preserved." },
            { label: "Alert mode", value: "Real-time", note: "High-acuity cases route instantly across nurse, doctor, and admin lanes." },
            { label: "Evidence mode", value: "Expanded", note: "Cards show model version, confidence, and the top evidence factors." },
          ]}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <OpsCards
            eyebrow="Security controls"
            title="Identity, privacy, and traceability"
            description="Settings should expose the trust model behind the AI system, not only UI preferences."
            tone="emerald"
            items={securityControls.map((control) => ({
              label: control.control,
              value: control.status,
              note: control.note,
            }))}
          />
          <NarrativeList
            eyebrow="Interoperability setup"
            title="Connected system routes"
            description="This keeps HL7, FHIR, pharmacy, and IoT integration visible in the admin configuration layer."
            items={interoperabilityFlows.map((flow) => ({
              title: `${flow.flow} • ${flow.standard}`,
              detail: `${flow.note} Current state: ${flow.status}.`,
            }))}
          />
        </div>
      </>
    )
  }

  if (slug === "logs") {
    return (
      <>
        <OpsCards
          eyebrow="Audit summary"
          title="System activity digest"
          description="Quick operational counters above the raw event stream make the log page more useful to staff."
          tone="amber"
          items={auditSummary.map((item) => ({ label: item.label, value: item.value, note: item.note }))}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <NarrativeList
            eyebrow="Immutable trail"
            title="Blockchain-style event history"
            description="The log surface should make auditability obvious because your paper treats traceability as a core system property."
            items={blockchainEvents.map((event) => ({
              title: `${event.actor} • ${event.event}`,
              detail: event.detail,
            }))}
          />
          <OpsCards
            eyebrow="Testing and maintenance"
            title="Reliability program"
            description="Logs should connect to testing, monitoring, and maintenance so the system feels production-grade."
            tone="violet"
            items={testingSignals.map((item) => ({
              label: item.label,
              value: item.value,
              note: item.note,
            }))}
          />
        </div>
        <LogsView />
      </>
    )
  }

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        {modelRegistry.map((model) => (
          <Surface key={model.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-white">{model.name}</div>
                <div className="mt-1 text-sm text-slate-400">{model.purpose}</div>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-medium", modelStatus(model.status))}>
                {model.status}
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SmallMetric label="Version" value={model.version} note={`Owner: ${model.owner}`} />
              <SmallMetric label="Accuracy" value={model.accuracy} note={`Drift: ${model.drift}`} />
            </div>
          </Surface>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <TrendCard title="Model confidence lanes" subtitle="Relative trust by active model family" color="#a78bfa" data={agentConsensusData} dataKey="value" kind="bar" />
        <NarrativeList
          eyebrow="Continuous learning"
          title="Feedback and promotion loop"
          description="This keeps the paper's continuous learning concept visible inside the product."
          items={modelFeedbackSignals.map((item) => ({
            title: item.step,
            detail: item.detail,
          }))}
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <OpsCards
          eyebrow="Algorithm registry"
          title="Clinical model inventory"
          description="This registry mirrors the exact algorithm families described in your methodology chapter."
          tone="violet"
          items={algorithmRegistry.map((item) => ({
            label: `${item.shorthand} • ${item.role}`,
            value: item.name,
            note: `${item.purpose}. ${item.note}`,
          }))}
        />
        <OpsCards
          eyebrow="Validation program"
          title="Testing and maintenance signals"
          description="Model governance should include testing, clinician review, and continuous maintenance, not just drift badges."
          tone="amber"
          items={testingSignals.map((item) => ({
            label: item.label,
            value: item.value,
            note: item.note,
          }))}
        />
      </div>
      <Surface>
        <SectionHeader eyebrow={meta.emphasis} title="Continuous learning loop" description="This page keeps the ML story connected to clinical workflow instead of hiding it in a technical appendix." />
        <div className="mt-6 space-y-4">
          {[
            "Clinicians review flagged decisions and confirm whether the recommendation was useful.",
            "Feedback enters the model evaluation queue with source agent, patient context, and alert outcome.",
            "Models with drift or lower precision move to monitoring or review before promotion.",
          ].map((step) => (
            <div key={step} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300">
              {step}
            </div>
          ))}
        </div>
      </Surface>
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <SignalBars
          title="Clinical note contribution"
          subtitle="Model governance should still show how much BERT-style note understanding contributes to downstream decisions."
          colorClass="bg-cyan-400"
          items={clinicalNoteSignals}
        />
        <NarrativeList
          eyebrow="Deployment fabric"
          title="Interoperability dependencies"
          description="Governance is stronger when model teams can see which data routes feed the live decision system."
          items={interoperabilityFlows.map((flow) => ({
            title: `${flow.flow} • ${flow.status}`,
            detail: `${flow.standard}: ${flow.note}`,
          }))}
        />
      </div>
    </>
  )
}
