"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Activity,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  LogOut,
  MoreVertical,
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
  Scan,
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
import { api } from "@/lib/api"
import { isNavVisible, roleGreeting, userInitials, type SessionUser } from "@/lib/auth"
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
  imagingModalities,
  imagingThroughputData,
  imagingAiFlagData,
  aiDoctorCapabilities,
  aiDoctorDataSources,
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
  "imaging-monitoring": Scan,
  settings: Settings,
  logs: ChevronRight,
  "model-insights": Brain,
} satisfies Record<PageSlug, React.ComponentType<{ className?: string }>>

function groupedNavigation(role: SessionUser["role"]) {
  const visible = navigationItems.filter((item) => isNavVisible(role, item.slug))
  return [
    { label: "Overview", items: visible.filter((item) => ["dashboard"].includes(item.slug)) },
    {
      label: "Patient Care",
      items: visible.filter((item) =>
        ["patients", "patient-registry", "alerts", "reports", "vitals-trends"].includes(item.slug),
      ),
    },
    {
      label: "AI System",
      items: visible.filter((item) =>
        [
          "ai-insights",
          "chat-assistant",
          "doctor-agent",
          "nurse-agent",
          "drug-agent",
          "admin-agent",
          "predictions",
          "imaging-monitoring",
        ].includes(item.slug),
      ),
    },
    {
      label: "Operations",
      items: visible.filter((item) =>
        ["hospital-load", "logs", "model-insights", "settings"].includes(item.slug),
      ),
    },
  ].filter((group) => group.items.length > 0)
}

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`
}

function toneClass(tone: MetricCard["tone"]) {
  switch (tone) {
    case "critical":
      return "bg-rose-50 border-rose-200 text-rose-900"
    case "warning":
      return "bg-amber-50 border-amber-200 text-amber-900"
    case "good":
      return "bg-emerald-50 border-emerald-200 text-emerald-900"
    case "info":
    default:
      return "bg-cyan-50 border-cyan-200 text-cyan-900"
  }
}

function statusClass(status: PatientRecord["status"]) {
  switch (status) {
    case "Critical":
      return "bg-rose-100 text-rose-900 ring-1 ring-inset ring-rose-200"
    case "Watch":
      return "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200"
    case "Improving":
      return "bg-cyan-100 text-cyan-900 ring-1 ring-inset ring-cyan-200"
    case "Stable":
    default:
      return "bg-emerald-100 text-emerald-900 ring-1 ring-inset ring-emerald-200"
  }
}

function severityClass(severity: IntelligenceAlert["severity"]) {
  switch (severity) {
    case "Critical":
      return "bg-rose-100 text-rose-900 ring-1 ring-inset ring-rose-200"
    case "High":
      return "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200"
    case "Medium":
    default:
      return "bg-cyan-100 text-cyan-900 ring-1 ring-inset ring-cyan-200"
  }
}

function agentClass(agent: AgentName) {
  switch (agent) {
    case "Doctor Agent":
      return "bg-cyan-100 text-cyan-900"
    case "Nurse Agent":
      return "bg-emerald-100 text-emerald-900"
    case "Drug Agent":
      return "bg-amber-100 text-amber-900"
    case "Admin Agent":
    default:
      return "bg-violet-100 text-violet-900"
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
  if (status === "Healthy") return "bg-emerald-100 text-emerald-900"
  if (status === "Monitoring") return "bg-amber-100 text-amber-900"
  return "bg-rose-100 text-rose-900"
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
        "rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm ",
        className,
      )}
    >
      {children}
    </section>
  )
}

function AgentPill({ agent }: { agent: AgentName }) {
  const imgSrc = agent === "Doctor Agent" ? "/doctor.png" : agent === "Nurse Agent" ? "/nurse.png" : undefined;
  return (
    <div className="flex items-center gap-2">
      {imgSrc && <img src={imgSrc} alt={agent} className="h-6 w-6 rounded-full shadow-sm bg-slate-50 object-cover" />}
      <span className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-medium", agentClass(agent))}>
        {agent}
      </span>
    </div>
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
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-600">
          {eyebrow}
        </div>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
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
    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
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
          <div className="text-sm font-medium text-slate-900">{title}</div>
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
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 16,
                  color: "#0f172a",
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
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 16,
                  color: "#0f172a",
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
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 16,
                  color: "#0f172a",
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
              <span className="text-slate-700">{item.label}</span>
              <span className="font-medium text-slate-900">{item.value}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className={cn("h-2 rounded-full", colorClass)} style={{ width: `${item.value}%` }} />
            </div>
            {item.note ? <div className="mt-2 text-xs leading-5 text-slate-400">{item.note}</div> : null}
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
          <div key={`${item.title}-${item.detail}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-medium text-slate-900">{item.title}</div>
              {item.tag ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
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
      ? "bg-emerald-100 text-emerald-900"
      : tone === "amber"
        ? "bg-amber-100 text-amber-900"
        : tone === "violet"
          ? "bg-violet-100 text-violet-900"
          : "bg-cyan-100 text-cyan-900"

  return (
    <Surface>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-[22px] border border-slate-200 bg-white p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</div>
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

type AlertWorkflowState = "New" | "Acknowledged" | "Escalated"

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

function clinicalAction(patient: PatientRecord) {
  if (patient.medications.includes("Warfarin") && patient.medications.includes("Aspirin")) {
    return "Review bleed-risk medication conflict"
  }
  if (patient.vitals.spo2Pct <= 90) return "Review oxygen stabilization now"
  if (patient.vitals.systolicMmHg <= 92) return "Review pressure support and ICU pathway"
  if (patient.status === "Critical") return "Review ICU transfer decision"
  return "Review next best action"
}

function patientSignalBadges(patient: PatientRecord) {
  const items: string[] = []
  if (patient.vitals.spo2Pct <= 92) items.push(`SpO2 ↓ ${patient.vitals.spo2Pct}%`)
  if (patient.vitals.systolicMmHg <= 95) items.push(`BP ↓ ${patient.vitals.systolicMmHg}/${patient.vitals.diastolicMmHg}`)
  if (patient.vitals.temperatureC >= 38) items.push(`Fever ↑ ${patient.vitals.temperatureC.toFixed(1)}°C`)
  const flaggedLab = patient.labReports.find((report) => report.status === "Critical" || report.status === "High")
  if (flaggedLab) items.push(`${flaggedLab.label} ${flaggedLab.value}`)
  if (!items.length) items.push(patient.summary)
  return items.slice(0, 3)
}

function patientDrivers(patient: PatientRecord) {
  const drivers = patientSignalBadges(patient)
  const trendNote =
    patient.trends.risk.at(-1)! > patient.trends.risk[0]
      ? `Trend: worsening over ${patient.trends.risk.length} checks`
      : "Trend: stable in the current window"
  return [...drivers, trendNote].slice(0, 4)
}

function riskBarClass(score: number) {
  if (score >= 80) return "bg-rose-500"
  if (score >= 60) return "bg-amber-500"
  if (score >= 35) return "bg-cyan-500"
  return "bg-emerald-500"
}

function alertClusterName(alert: IntelligenceAlert) {
  const text = `${alert.title} ${alert.description} ${alert.tag}`.toLowerCase()
  if (text.includes("oxygen") || text.includes("spo2")) return "Oxygen Alerts"
  if (text.includes("sepsis")) return "Sepsis Alerts"
  if (text.includes("drug") || text.includes("medication") || text.includes("warfarin") || text.includes("aspirin")) {
    return "Drug Conflicts"
  }
  if (text.includes("icu") || text.includes("capacity")) return "ICU Queue"
  return "Critical Reviews"
}

function resolveAlertPatientId(alert: IntelligenceAlert) {
  const text = `${alert.title} ${alert.description}`.toLowerCase()
  return patients.find((patient) => text.includes(patient.firstName.toLowerCase()) || text.includes(patient.lastName.toLowerCase()))?.id
}

function aggregateAlertState(alertIds: string[], alertStates: Record<string, AlertWorkflowState>) {
  const states = alertIds.map((id) => alertStates[id] ?? "New")
  if (states.includes("Escalated")) return "Escalated"
  if (states.every((state) => state === "Acknowledged")) return "Acknowledged"
  return "New"
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
          className="rounded-[24px] border border-dashed border-cyan-200 bg-cyan-50 p-6 text-left transition hover:border-cyan-300 hover:bg-cyan-100"
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
            <div className="grid h-12 w-12 place-items-center rounded-[18px] bg-cyan-600 text-white">
              <FileUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">Drop in or select reports</div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                Current patient: {patientLabel(selectedPatient)}. Accepted formats include PDF, image, DOCX, and CSV.
              </div>
              <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
                AI extracts labs, notes, medication clues, and summary updates automatically
              </div>
            </div>
          </div>
        </button>
        <div className="space-y-3">
          {patientReports.length ? (
            patientReports.map((report) => (
              <div key={report.id} className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-[16px] bg-slate-100 text-slate-700">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{report.name}</div>
                      <div className="mt-1 text-xs text-slate-400">
                        {report.category} • {report.size} • {report.uploadedAt}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      report.status === "Indexed" ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900",
                    )}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-400">{report.summary}</div>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-400">
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
          <div key={item.source} className="rounded-[24px] border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-900">{item.source}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">{item.ingestion}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.agents.map((agent) => (
                  <AgentPill key={`${item.source}-${agent}`} agent={agent} />
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">What we derive</div>
                <div className="mt-3 space-y-2">
                  {item.outputs.map((output) => (
                    <div key={output} className="text-sm leading-6 text-slate-600">
                      - {output}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Where it shows up</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.ui.map((surface) => (
                    <span key={surface} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
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
    <div className="w-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-900">{item.title}</div>
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
                  ? "bg-cyan-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-slate-900",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[0.28fr_0.72fr]">
        <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Selected signal</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{item.current}</div>
          <div className="mt-2 text-sm leading-6 text-slate-400">{item.note}</div>
        </div>
        <div className="h-64 rounded-[22px] border border-slate-200 bg-white p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={item.data}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 16,
                  color: "#0f172a",
                }}
              />
              <Bar dataKey="value" fill={item.color} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
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

function contextualPrompts(slug: PageSlug, patient: PatientRecord) {
  const name = patientLabel(patient)

  switch (slug) {
    case "dashboard":
      return [
        "Show all ICU candidates",
        `Explain ${name} deterioration`,
        "List drug conflicts today",
        "Give me the next best action",
      ]
    case "patients":
      return [
        `Summarize ${name}`,
        `Show latest vitals for ${name}`,
        `Compare previous state for ${name}`,
        `What should happen next for ${name}?`,
      ]
    case "alerts":
      return [
        "Which alerts need escalation first?",
        `Why is ${name} on the escalation queue?`,
        "Group oxygen alerts",
        "Show open bedside actions",
      ]
    case "doctor-agent":
      return [
        `What is the leading diagnosis for ${name}?`,
        `Why is the model high risk for ${name}?`,
        `Show lab drivers for ${name}`,
        "What differentials were considered?",
      ]
    case "nurse-agent":
      return [
        `Show monitoring summary for ${name}`,
        `Is ${name} oxygen stabilizing?`,
        `What bedside action is next for ${name}?`,
        "List patients needing immediate reassessment",
      ]
    case "drug-agent":
      return [
        `Check medication conflicts for ${name}`,
        `Show allergy risks for ${name}`,
        "List drug conflicts today",
        "Which medications need review now?",
      ]
    case "admin-agent":
      return [
        "Show ICU queue priority",
        "What is current hospital load?",
        "Which patients need transfer review?",
        "Summarize staffing pressure",
      ]
    case "ai-insights":
    case "predictions":
    case "model-insights":
      return [
        `Why is ${name} high risk?`,
        "Explain model confidence",
        `Show top drivers for ${name}`,
        "Compare current and previous prediction state",
      ]
    default:
      return [
        `Summarize ${name}`,
        "Show all ICU candidates",
        "List drug conflicts today",
        "Give me the next best action",
      ]
  }
}

function buildPagePulse(slug: PageSlug, patient: PatientRecord): SimulatedReply {
  const name = patientLabel(patient)
  const prompts = contextualPrompts(slug, patient)

  switch (slug) {
    case "dashboard":
      return {
        agent: "Doctor Agent",
        route: "Command center pulse",
        body: [
          bulletBlock("Live command brief", [
            `${name} remains the active focus with ${patient.riskScore}% predicted deterioration risk.`,
            `${clinicalAction(patient)} is the top recommendation from the current multi-agent simulation.`,
          ]),
          bulletBlock("Fast actions ready", prompts.slice(0, 3)),
        ].join("\n\n"),
      }
    case "alerts":
      return {
        agent: "Admin Agent",
        route: "Alert triage pulse",
        body: [
          bulletBlock("Alert queue brief", [
            "The alert board is grouped and ready for acknowledge, assign, and escalate actions.",
            `${name} is one of the key cases to keep in the active escalation loop.`,
          ]),
          bulletBlock("Fast actions ready", prompts.slice(0, 3)),
        ].join("\n\n"),
      }
    case "patients":
      return {
        agent: "Doctor Agent",
        route: "Patient workspace pulse",
        body: [
          bulletBlock("Patient workspace brief", [
            `${name} is loaded into the clinical workspace with diagnosis, vitals, medications, and timeline context.`,
            "You can ask for summaries, explainability, trend comparison, or next-step guidance directly from this page.",
          ]),
          bulletBlock("Fast actions ready", prompts.slice(0, 3)),
        ].join("\n\n"),
      }
    case "drug-agent":
      return {
        agent: "Drug Agent",
        route: "Medication safety pulse",
        body: [
          bulletBlock("Medication safety brief", [
            "Drug safety simulation is active with allergy guards, interaction checks, and dosage review messaging.",
            `Use ${name} to demo patient-specific medication review in the frontend.`,
          ]),
          bulletBlock("Fast actions ready", prompts.slice(0, 3)),
        ].join("\n\n"),
      }
    case "nurse-agent":
      return {
        agent: "Nurse Agent",
        route: "Monitoring pulse",
        body: [
          bulletBlock("Bedside monitoring brief", [
            "Telemetry simulation is active with oxygen, blood pressure, temperature, and trend monitoring language.",
            `${name} is the best case to demo bedside reassessment and oxygen escalation.`,
          ]),
          bulletBlock("Fast actions ready", prompts.slice(0, 3)),
        ].join("\n\n"),
      }
    case "admin-agent":
      return {
        agent: "Admin Agent",
        route: "Operations pulse",
        body: [
          bulletBlock("Operations brief", [
            "Hospital flow simulation is active with ICU queue, staffing pressure, and bed orchestration messaging.",
            `${name} can be used to demonstrate transfer priority and escalation routing.`,
          ]),
          bulletBlock("Fast actions ready", prompts.slice(0, 3)),
        ].join("\n\n"),
      }
    default:
      return {
        agent: "Doctor Agent",
        route: "Assistant pulse",
        body: [
          bulletBlock("Frontend AI brief", [
            `The assistant is running in frontend-only simulation mode for ${name}.`,
            "Prompts, route selection, streaming states, and follow-up messages are all demo-ready without backend calls.",
          ]),
          bulletBlock("Fast actions ready", prompts.slice(0, 3)),
        ].join("\n\n"),
      }
  }
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
          <div className="rounded-[22px] bg-slate-50/72 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-slate-700">{item.label}</div>
                <div className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {item.delta}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{item.note}</p>
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
    <div className="space-y-3">
      {rows.length === 0 ? (
        <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
          No critical alerts right now. System stable across all wards.
        </div>
      ) : null}
      <div className="space-y-3">
        {rows.map((patient) => (
          <div
            key={patient.id}
            className={cn(
              "rounded-[24px] border bg-white p-4 transition",
              patient.id === selectedId ? "border-cyan-200 shadow-sm" : "border-slate-200",
            )}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-lg font-semibold text-slate-900">
                    {patient.firstName} {patient.lastName}
                  </div>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusClass(patient.status))}>
                    {patient.status.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-slate-500">{patient.riskScore}% risk</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {patientSignalBadges(patient).map((signal) => (
                    <span
                      key={`${patient.id}-${signal}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
                <div className="mt-3 text-sm text-slate-600">{clinicalAction(patient)}</div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full", riskBarClass(patient.riskScore))} style={{ width: `${patient.riskScore}%` }} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span>Updated {patient.lastUpdated}</span>
                  <span>•</span>
                  <span>
                    {patient.mrn} • {patient.ward} • {patient.room}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white text-slate-700"
                  onClick={() => startTransition(() => onSelect(patient.id))}
                >
                  Review patient
                </Button>
                <Button
                  type="button"
                  className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                  onClick={() => startTransition(() => onSelect(patient.id))}
                >
                  {clinicalAction(patient)}
                </Button>
              </div>
            </div>
          </div>
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
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{item.type}</div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {formatConfidence(item.confidence)}
            </span>
          </div>
          <p className="mt-3 text-sm font-medium text-slate-700">{item.summary}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{item.explanation}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <AgentPill agent={item.agent} />
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">WHY surfaced</span>
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
  onQuickPrompt,
  onReset,
  selectedPatient,
  assistantState,
  compact = false,
}: {
  messages: ChatMessage[]
  draft: string
  setDraft: (value: string) => void
  onSend: () => void
  onQuickPrompt: (prompt: string) => void
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
        <div className="rounded-[22px] border border-slate-200 bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Active patient</div>
          <div className="mt-2 text-sm font-medium text-slate-900">{patientLabel(selectedPatient)}</div>
          <div className="mt-1 text-xs text-slate-400">
            {selectedPatient.status} • {selectedPatient.riskScore}% risk • {selectedPatient.room}
          </div>
        </div>
        <div className="rounded-[22px] border border-slate-200 bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Assistant state</div>
          <div className="mt-2 text-sm font-medium text-slate-900">
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
          <div className="rounded-[22px] border border-slate-200 bg-white p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Conversation mode</div>
            <div className="mt-2 text-sm font-medium text-slate-900">ChatGPT-style simulation</div>
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
              message.role === "user"
                ? "ml-auto border border-cyan-200 bg-cyan-50 text-cyan-950"
                : "border border-slate-200 bg-slate-50 text-slate-900",
            )}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
              {message.agent ? <span>{message.agent}</span> : null}
              {message.route ? (
                <span className="rounded-full bg-white px-2 py-1 normal-case tracking-normal text-slate-600 ring-1 ring-slate-200">
                  {message.route}
                </span>
              ) : null}
            </div>
            <div className="whitespace-pre-wrap text-sm leading-6">{message.body}</div>
          </div>
        ))}
        {assistantState.phase !== "idle" ? (
          <div className="max-w-[88%] rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
              <span>{assistantState.agent ?? "Hospital OS"}</span>
              {assistantState.route ? (
                <span className="rounded-full bg-white px-2 py-1 normal-case tracking-normal text-slate-600 ring-1 ring-slate-200">
                  {assistantState.route}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
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
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Suggested queries
          </div>
          <div className="text-xs text-slate-500">One tap runs the request immediately</div>
        </div>
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
            "rounded-[24px] border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400",
            compact ? "min-h-[84px]" : "min-h-[120px]",
          )}
          placeholder="Ask anything: summarize the patient, show vitals, explain the model, compare ICU demand, or inspect drug safety."
        />
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.slice(0, compact ? 3 : 6).map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onQuickPrompt(prompt)}
              disabled={assistantState.phase !== "idle"}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:border-cyan-200 hover:text-slate-900"
            >
              Run: {prompt}
            </button>
          ))}
        </div>
        <div className={cn("flex items-center gap-3", compact ? "justify-end" : "justify-between")}>
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className={cn(
              "rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:bg-white/10",
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

function AssistantDock({
  slug,
  selectedPatient,
  messages,
  draft,
  setDraft,
  onSend,
  onQuickPrompt,
  assistantState,
}: {
  slug: PageSlug
  selectedPatient: PatientRecord
  messages: ChatMessage[]
  draft: string
  setDraft: (value: string) => void
  onSend: () => void
  onQuickPrompt: (prompt: string) => void
  assistantState: AssistantState
}) {
  const prompts = contextualPrompts(slug, selectedPatient)
  const recentMessages = messages.slice(-3)

  return (
    <Surface className="border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700">
            <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-500" />
            Frontend AI Command Dock
          </div>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            Multi-agent chat is simulated and ready on this page
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            This dock keeps the assistant feeling live across the frontend with route-aware prompts, streaming states,
            and page-specific responses for {patientLabel(selectedPatient)}.
          </p>
        </div>
        <Link
          href="/chat-assistant"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:text-slate-950"
        >
          <MessageSquare className="h-4 w-4" />
          Open full chat
        </Link>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="rounded-[22px] border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Live status</div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {assistantState.phase === "idle"
                    ? "Ready for prompt execution"
                    : assistantState.phase === "routing"
                      ? "Routing to the best agent"
                      : "Generating clinical response"}
                </div>
              </div>
              <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
            </div>
            <div className="mt-2 text-sm text-slate-500">
              {assistantState.route ? `${assistantState.agent} • ${assistantState.route}` : "Frontend-only AI simulation active"}
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-white p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Suggested actions</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <Button
                  key={prompt}
                  type="button"
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white text-slate-700"
                  onClick={() => onQuickPrompt(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-slate-200 bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Recent assistant activity</div>
          <div className="mt-3 space-y-3">
            {recentMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "rounded-[18px] border px-4 py-3 text-sm leading-6",
                  message.role === "user"
                    ? "border-cyan-200 bg-cyan-50 text-cyan-950"
                    : "border-slate-200 bg-slate-50 text-slate-900",
                )}
              >
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  <span>{message.role === "user" ? "Clinician" : message.agent ?? "Hospital OS"}</span>
                  {message.route ? (
                    <span className="rounded-full bg-white px-2 py-1 normal-case tracking-normal text-slate-600 ring-1 ring-slate-200">
                      {message.route}
                    </span>
                  ) : null}
                </div>
                <div className="line-clamp-4 whitespace-pre-wrap">{message.body}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
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
              className="min-h-[96px] rounded-[20px] border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
              placeholder="Ask the simulated agents anything about this page context."
            />
            <Button
              type="button"
              onClick={onSend}
              disabled={assistantState.phase !== "idle"}
              className="rounded-[20px] bg-slate-900 px-5 text-white hover:bg-slate-800 sm:self-end"
            >
              {assistantState.phase === "idle" ? "Run prompt" : "Working..."}
            </Button>
          </div>
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
                      ? "bg-rose-100 text-rose-900"
                      : row.level === "Warning"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-cyan-100 text-cyan-900",
                  )}
                >
                  {row.level}
                </span>
                <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  {row.service}
                </span>
              </div>
              <div className="text-lg font-medium text-slate-900">{row.summary}</div>
              <div className="text-sm leading-6 text-slate-400">{row.detail}</div>
            </div>
            <div className="text-sm text-slate-400">{row.at}</div>
          </div>
        </Surface>
      ))}
    </div>
  )
}

export function HospitalWorkbench({ slug, user }: { slug: PageSlug; user: SessionUser }) {
  const router = useRouter()
  const meta = pageMeta[slug]
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id ?? "")
  const [patientTab, setPatientTab] = useState("overview")
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const [messages, setMessages] = useState<ChatMessage[]>(chatSeed)
  const [draft, setDraft] = useState("Why is patient critical?")
  const [assistantState, setAssistantState] = useState<AssistantState>({ phase: "idle" })
  const [alertStates, setAlertStates] = useState<Record<string, AlertWorkflowState>>({})
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
  const assistantContextRef = useRef("")

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

  const topActionPatients = useMemo(
    () =>
      [...patients]
        .filter((patient) => patient.status === "Critical" || patient.riskScore >= 70)
        .sort((left, right) => right.riskScore - left.riskScore)
        .slice(0, 2),
    [],
  )

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

  function queuePrompt(promptText: string) {
    const prompt = promptText.trim()
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

  function sendMessage() {
    queuePrompt(draft)
  }

  function sendQuickPrompt(prompt: string) {
    setDraft(prompt)
    queuePrompt(prompt)
  }

  function updateAlertState(ids: string[], nextState: AlertWorkflowState) {
    setAlertStates((current) => ({
      ...current,
      ...Object.fromEntries(ids.map((id) => [id, nextState])),
    }))
  }

  useEffect(() => {
    const contextKey = `${slug}:${selectedPatientId}`
    if (assistantContextRef.current === contextKey) return
    assistantContextRef.current = contextKey

    const pulse = buildPagePulse(slug, selectedPatient)
    setMessages((current) => {
      if (current.some((message) => message.route === pulse.route && message.body === pulse.body)) {
        return current
      }

      return [
        ...current,
        {
          id: nextMessageId("a"),
          role: "assistant",
          body: pulse.body,
          agent: pulse.agent,
          route: pulse.route,
        },
      ]
    })
  }, [selectedPatient, selectedPatientId, slug])

  const navGroups = groupedNavigation(user.role)
  const visibleNavItems = navigationItems.filter((item) => isNavVisible(user.role, item.slug))

  async function handleLogout() {
    try {
      await api<{ loggedOut: boolean }>("/api/auth/logout", { method: "POST" })
    } finally {
      router.push("/login")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f6f9] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full gap-3 px-2 py-3 lg:px-3 xl:px-4">
        <aside className="hidden w-[280px] shrink-0 xl:block">
          <div className="sticky top-3 rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-[22px] bg-gradient-to-br from-emerald-300 to-cyan-300 text-slate-950 shadow-[0_16px_40px_rgba(34,211,238,0.2)]">
                <span className="text-lg font-bold">AI</span>
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">Hospital OS</div>
                <div className="mt-1 text-sm text-slate-400">Doctor, Nurse, Drug, Admin mesh</div>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">System state</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">Live simulation active</div>
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
                  <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
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
                              ? "bg-cyan-400/14 text-slate-900 ring-1 ring-inset ring-cyan-200"
                              : "text-slate-600 hover:bg-white hover:text-slate-900",
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={cn(
                                "grid h-10 w-10 place-items-center rounded-2xl",
                                active ? "bg-cyan-400/14 text-cyan-100" : "bg-white text-slate-400",
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
          <div className="sticky top-3 z-20 rounded-[30px] border border-slate-200 bg-white/80 backdrop-blur-md p-3 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNavOpen((open) => !open)}
                  className="grid h-12 w-12 place-items-center rounded-[18px] border border-slate-200 bg-white xl:hidden"
                >
                  <BarChart3 className="h-5 w-5" />
                </button>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-600">
                    {meta.eyebrow}
                  </div>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Hello, {user.name}</h1>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-violet-500">
                    {roleGreeting(user.role)}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{meta.description}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative min-w-[260px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search patients, rooms, or MRN"
                    className="h-12 rounded-full border-slate-200 bg-slate-50 pl-11 text-slate-900"
                  />
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
                  {timeLabel}
                </div>
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300 text-sm font-semibold text-slate-950">
                    {userInitials(user.name)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-400 capitalize">
                      {user.department ?? user.role}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>

            {navOpen ? (
              <div className="mt-4 grid gap-2 rounded-[24px] border border-slate-200 bg-black/10 p-3 xl:hidden">
                {visibleNavItems.map((item) => {
                  const Icon = pageIcons[item.slug]
                  return (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className={cn(
                        "flex items-center justify-between rounded-[18px] px-3 py-3 text-sm",
                        item.slug === slug ? "bg-cyan-400/14 text-slate-900" : "bg-white text-slate-600",
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
            {slug === "dashboard" ? (
              <div className="sticky top-[106px] z-10 rounded-[28px] border border-rose-200 bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 px-5 py-4 text-white shadow-[0_18px_40px_rgba(225,29,72,0.18)]">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-100">
                      <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
                      Action Required
                    </div>
                    <div className="mt-2 text-2xl font-semibold">
                      {topActionPatients.length} critical patients need review in the next 30 seconds
                    </div>
                    <div className="mt-1 text-sm text-rose-50/90">
                      Focus the team on immediate bedside action first, then review passive analytics.
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topActionPatients.map((patient) => (
                      <Button
                        key={patient.id}
                        type="button"
                        onClick={() => startTransition(() => setSelectedPatientId(patient.id))}
                        className="rounded-full bg-white text-rose-700 hover:bg-rose-50"
                      >
                        {`Review ${patient.firstName} ${patient.lastName} → ${clinicalAction(patient)}`}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
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
              sendQuickPrompt,
              resetConversation,
              assistantState,
              alertStates,
              updateAlertState,
              dashboardMetricView,
              setDashboardMetricView,
              uploadedReports,
              handleReportUpload,
              onSelectPatient: setSelectedPatientId,
              patientTab,
              setPatientTab,
            })}
            {slug !== "chat-assistant" ? (
              <AssistantDock
                slug={slug}
                selectedPatient={selectedPatient}
                messages={messages}
                draft={draft}
                setDraft={setDraft}
                onSend={sendMessage}
                onQuickPrompt={sendQuickPrompt}
                assistantState={assistantState}
              />
            ) : null}
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
  sendQuickPrompt,
  resetConversation,
  assistantState,
  alertStates,
  updateAlertState,
  dashboardMetricView,
  setDashboardMetricView,
  uploadedReports,
  handleReportUpload,
  onSelectPatient,
  patientTab,
  setPatientTab,
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
  sendQuickPrompt: (prompt: string) => void
  resetConversation: () => void
  assistantState: AssistantState
  alertStates: Record<string, AlertWorkflowState>
  updateAlertState: (ids: string[], nextState: AlertWorkflowState) => void
  dashboardMetricView: DashboardMetricKey
  setDashboardMetricView: (value: DashboardMetricKey) => void
  uploadedReports: UploadedReport[]
  handleReportUpload: (files: FileList | null) => void
  onSelectPatient: (id: string) => void
  patientTab: string
  setPatientTab: (tab: string) => void
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
    const criticalPatients = [...patients]
      .filter((patient) => patient.status === "Critical" || patient.riskScore >= 60)
      .sort((left, right) => right.riskScore - left.riskScore)
      .slice(0, 5)

    const decisionQueue = criticalPatients.slice(0, 2)

    const groupedAlerts = Object.values(
      liveAlerts.reduce(
        (groups, alert) => {
          const name = alertClusterName(alert)
          const current = groups[name] ?? { name, alerts: [] as IntelligenceAlert[] }
          current.alerts.push(alert)
          groups[name] = current
          return groups
        },
        {} as Record<string, { name: string; alerts: IntelligenceAlert[] }>,
      ),
    )
      .map((group) => {
        const ids = group.alerts.map((alert) => alert.id)
        return {
          ...group,
          ids,
          patientId: resolveAlertPatientId(group.alerts[0]),
          state: aggregateAlertState(ids, alertStates),
        }
      })
      .sort((left, right) => right.alerts.length - left.alerts.length)

    const selectedDrivers = patientDrivers(selectedPatient)
    const selectedCriticalLabs = selectedPatient.labReports.filter(
      (report) => report.status === "Critical" || report.status === "High",
    )

    return (
      <div className="mx-auto max-w-[1600px] space-y-6 pb-10">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Surface className="border-rose-200 bg-gradient-to-br from-rose-50 via-white to-orange-50">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-700">
                    <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" />
                    Immediate danger
                  </div>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                    4 patients require immediate review. 2 meet ICU escalation criteria.
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Act on the next 30 seconds first, then move into passive analytics. This page is organized around clinical action, not dashboard decoration.
                  </p>
                </div>
                <div className="rounded-[24px] border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                    Live telemetry
                  </div>
                  <div className="mt-1 text-slate-500">Updated {selectedPatient.lastUpdated}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                {decisionQueue.map((patient) => (
                  <div key={patient.id} className="rounded-[24px] border border-rose-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-slate-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {clinicalAction(patient)} • {patient.riskScore}% risk
                        </div>
                      </div>
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
                        {patient.status}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {patientSignalBadges(patient).map((signal) => (
                        <span
                          key={`${patient.id}-${signal}`}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          {signal}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        className="rounded-full bg-rose-600 text-white hover:bg-rose-700"
                        onClick={() => startTransition(() => onSelectPatient(patient.id))}
                      >
                        {`Review ${patient.firstName} ${patient.lastName} → ${clinicalAction(patient)}`}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-slate-200 bg-white text-slate-700"
                        onClick={() => sendQuickPrompt(`Explain ${patient.firstName} ${patient.lastName} deterioration`)}
                      >
                        View explanation
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <Surface>
                <SectionHeader
                  eyebrow="Alert intelligence"
                  title="Grouped alert triage"
                  description="Duplicate signals are grouped into clinical problem buckets so teams can acknowledge, assign, or escalate without alert fatigue."
                />
                <div className="mt-5 space-y-4">
                  {groupedAlerts.map((group) => {
                    const stateClass =
                      group.state === "Escalated"
                        ? "bg-rose-100 text-rose-800"
                        : group.state === "Acknowledged"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"

                    return (
                      <div key={group.name} className="rounded-[24px] border border-slate-200 bg-white p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-base font-semibold text-slate-900">{group.name}</div>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                {group.alerts.length}
                              </span>
                              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", stateClass)}>
                                {group.state}
                              </span>
                            </div>
                            <div className="mt-2 text-sm leading-6 text-slate-600">{group.alerts[0]?.description}</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {group.alerts.map((alert) => (
                                <span
                                  key={alert.id}
                                  className={cn("rounded-full px-3 py-1 text-xs font-medium", severityClass(alert.severity))}
                                >
                                  {alert.title}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-full border-slate-200 bg-white text-slate-700"
                              onClick={() => updateAlertState(group.ids, "Acknowledged")}
                            >
                              Acknowledge
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-full border-slate-200 bg-white text-slate-700"
                              onClick={() => {
                                if (group.patientId) startTransition(() => onSelectPatient(group.patientId))
                              }}
                            >
                              Assign
                            </Button>
                            <Button
                              type="button"
                              className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                              onClick={() => {
                                updateAlertState(group.ids, "Escalated")
                                if (group.patientId) startTransition(() => onSelectPatient(group.patientId))
                              }}
                            >
                              Escalate
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Surface>

              <Surface>
                <SectionHeader
                  eyebrow="AI reasoning"
                  title={`Why ${selectedPatient.firstName} ${selectedPatient.lastName} is critical`}
                  description="Doctors trust reasoning, trend movement, and drivers more than one isolated number."
                />
                <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-slate-500">Clinical risk</div>
                      <div className="mt-1 text-3xl font-semibold text-slate-900">
                        {selectedPatient.status === "Critical" ? "HIGH" : "WATCH"} ({selectedPatient.riskScore}%)
                      </div>
                    </div>
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">
                      {selectedPatient.model}
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {selectedDrivers.map((driver) => (
                      <div
                        key={driver}
                        className="flex items-start justify-between gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3"
                      >
                        <div className="text-sm font-medium text-slate-800">{driver}</div>
                        <ChevronRight className="mt-0.5 h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                    Next step: {clinicalAction(selectedPatient)}.
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      className="rounded-full bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                      onClick={() => sendQuickPrompt(`Explain ${selectedPatient.firstName} ${selectedPatient.lastName} deterioration`)}
                    >
                      View full explanation
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full border-slate-200 bg-white text-slate-700"
                      onClick={() => sendQuickPrompt(`Compare previous state for ${selectedPatient.firstName} ${selectedPatient.lastName}`)}
                    >
                      Compare previous state
                    </Button>
                  </div>
                </div>
              </Surface>
            </div>

            <Surface>
              <SectionHeader
                eyebrow="Review queue"
                title="Patients who need immediate review"
                description="Each row is designed for rapid scanning: who is unstable, why they are unstable, and what to do now."
              />
              <div className="mt-5">
                <PatientTable rows={criticalPatients} selectedId={selectedPatientId} onSelect={onSelectPatient} />
              </div>
            </Surface>

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <TrendCard
                title="Passive analytics"
                subtitle="Keep trends available, but clearly below urgent actions."
                color={dashboardMetricConfig[dashboardMetricView].color}
                data={dashboardMetricConfig[dashboardMetricView].data}
                dataKey="value"
                kind={dashboardMetricView === "risk" ? "area" : "line"}
              />
              <NarrativeList
                eyebrow="Care progression"
                title="What should happen next"
                description="Clinical copy is direct and operational, not decorative."
                items={decisionQueue.map((patient) => ({
                  title: `${patient.firstName} ${patient.lastName} • ${clinicalAction(patient)}`,
                  detail: `${patient.reason} Updated ${patient.lastUpdated}. Assigned to ${patient.assignedAgent}.`,
                  tag: patient.status,
                }))}
              />
            </div>
          </div>

          <div className="space-y-6">
            <MetricGrid items={metrics} />

            <Surface>
              <SectionHeader
                eyebrow="Command center"
                title="Use the assistant like an operator"
                description="Suggested queries are one-click actions so the assistant behaves like a real clinical co-pilot."
              />
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Show all ICU candidates",
                  `Explain ${selectedPatient.firstName} ${selectedPatient.lastName} deterioration`,
                  "List drug conflicts today",
                  "Give me the next best action",
                ].map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    variant="outline"
                    className="rounded-full border-slate-200 bg-white text-slate-700"
                    onClick={() => sendQuickPrompt(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
              <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-slate-900">System heartbeat</div>
                    <div className="mt-1 text-sm text-slate-500">
                      Updated {selectedPatient.lastUpdated} • {liveAlerts.length} active grouped signals
                    </div>
                  </div>
                  <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
                </div>
              </div>
            </Surface>

            <ChatPanel
              messages={messages}
              draft={draft}
              setDraft={setDraft}
              onSend={sendMessage}
              onQuickPrompt={sendQuickPrompt}
              onReset={resetConversation}
              selectedPatient={selectedPatient}
              assistantState={assistantState}
              compact
            />

            <Surface>
              <SectionHeader
                eyebrow="Explainability depth"
                title="Evidence doctors can trust"
                description="Top drivers, clear trend movement, and critical lab evidence sit next to the AI recommendation."
              />
              <div className="mt-5 space-y-3">
                {selectedCriticalLabs.length ? (
                  selectedCriticalLabs.map((report) => (
                    <div key={report.label} className="rounded-[20px] border border-slate-200 bg-white px-4 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-slate-900">{report.label}</div>
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
                          {report.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-slate-500">{report.value}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
                    No critical lab drivers are active right now for the selected patient.
                  </div>
                )}
              </div>
            </Surface>
          </div>
        </div>
      </div>
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
            <div className="mt-5 rounded-[22px] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-400">
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
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Local Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-white rounded-t-xl px-4 pt-4 shadow-sm">
          {["overview", "clinical", "medications", "care plans", "timeline"].map(tab => (
            <button
              key={tab}
              onClick={() => setPatientTab(tab)}
              className={("px-6 py-3 text-sm font-medium capitalize outline-none transition-colors " + (patientTab === tab ? "border-b-2 border-cyan-600 text-cyan-700" : "text-slate-500 hover:text-slate-700 hover:border-slate-300"))}
            >
              {tab === "clinical" ? "Clinical data" : tab}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr] 2xl:grid-cols-[0.8fr_1.2fr]">
          {/* Patient Selector Strip */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Directory</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500">{filteredPatients.length} Active</span>
            </div>
            <div className="space-y-2 h-[600px] overflow-y-auto pr-2">
              {filteredPatients.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => {
                    startTransition(() => onSelectPatient(patient.id))
                    setPatientTab("overview")
                  }}
                  className={("flex w-full items-center gap-4 rounded-xl border p-3 text-left transition " + (patient.id === selectedPatientId ? "border-cyan-200 bg-cyan-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"))}
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 font-bold">
                    {patient.firstName[0]}{patient.lastName[0]}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate font-semibold text-slate-900">{patient.firstName} {patient.lastName}</div>
                    <div className="truncate text-xs text-slate-500">ID: {patient.mrn} • Ward {patient.ward}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Context/Overview Hero */}
            <div className="bg-white p-6 rounded-[28px] shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-600 outline outline-1 outline-cyan-200">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedPatient.firstName} {selectedPatient.lastName}</h2>
                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <span>ID: {selectedPatient.mrn}</span>
                      <span>•</span>
                      <span>Ward: {selectedPatient.ward} (Rm {selectedPatient.room})</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <AgentPill agent={selectedPatient.assignedAgent} />
                </div>
              </div>

              {patientTab === "overview" && (
                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Clinical Snapshot</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase">AI Diagnosis</div>
                      <div className="mt-2 text-lg font-bold text-slate-900 leading-tight">{selectedPatient.diagnosis}</div>
                      <div className="mt-2 text-xs text-slate-500">{selectedPatient.model}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase">Risk Score</div>
                      <div className="mt-2 text-3xl font-bold text-slate-900">{selectedPatient.riskScore}%</div>
                      <div className="mt-1 text-xs text-slate-500">Predicted trajectory</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase">Current Status</div>
                      <div className="mt-3">
                        <span className={("inline-flex rounded-full px-3 py-1 text-xs font-bold " + statusClass(selectedPatient.status))}>
                          {selectedPatient.status}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase">Vitals Overview</div>
                      <div className="mt-2 text-sm font-medium text-slate-900 flex justify-between"><span>HR</span><span>{selectedPatient.vitals.heartRateBpm} bpm</span></div>
                      <div className="mt-1 text-sm font-medium text-slate-900 flex justify-between"><span>SpO2</span><span>{selectedPatient.vitals.spo2Pct}%</span></div>
                      <div className="mt-1 text-sm font-medium text-slate-900 flex justify-between"><span>BP</span><span>{selectedPatient.vitals.systolicMmHg}/{selectedPatient.vitals.diastolicMmHg}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {patientTab === "timeline" && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Monitoring Timeline</h3>
                  <div className="border-l-2 border-slate-100 ml-3 pl-4 space-y-6">
                    {selectedPatient.timeline.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-cyan-500" />
                        <div className="text-sm text-slate-900 bg-slate-50 rounded-lg p-3 border border-slate-100">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {patientTab === "care plans" && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Patient Care Strategies</h3>
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden text-sm">
                    <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-600">
                      <div>Plan Phase</div>
                      <div className="w-24">Priority</div>
                      <div className="w-40">Agent</div>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-slate-100 px-4 py-3">
                      <div className="text-slate-900">{selectedPatient.reason}</div>
                      <div className="w-24"><span className="rounded bg-rose-50 px-2 py-1 text-xs text-rose-600 font-bold">High</span></div>
                      <div className="w-40"><AgentPill agent={selectedPatient.assignedAgent} /></div>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3">
                      <div className="text-slate-900">Monitor stability per primary evaluation</div>
                      <div className="w-24"><span className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-600 font-bold">Medium</span></div>
                      <div className="w-40"><AgentPill agent={selectedPatient.assignedAgent} /></div>
                    </div>
                  </div>
                </div>
              )}

              {patientTab === "medications" && (
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Active Prescriptions</h3>
                    <AgentPill agent="Drug Agent" />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden text-sm">
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-600">
                      <div>Medication</div>
                      <div>Status / Warnings</div>
                    </div>
                    {selectedPatient.medications.length === 0 ? (
                      <div className="p-4 text-slate-500">No active medications recorded</div>
                    ) : (
                      selectedPatient.medications.map((med, i) => (
                        <div key={i} className="grid grid-cols-2 items-center gap-4 border-b last:border-b-0 border-slate-100 px-4 py-3">
                          <div className="font-semibold text-slate-900">{med}</div>
                          <div className="text-slate-500">Active — clear of detected conflicts</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {patientTab === "clinical" && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Vitals Trends</h3>
                  <div className="grid gap-4 xl:grid-cols-2">
                    <TrendCard title="SpO2 trend" subtitle="Oxygen stability over the latest window" color="#10B981" data={spo2Data} dataKey="value" />
                    <TrendCard title="Risk trajectory" subtitle="Predicted deterioration movement" color="#0ea5e9" data={patientRiskData} dataKey="value" kind="area" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (slug === "alerts") {
    const groupedAlerts = Object.values(
      liveAlerts.reduce(
        (groups, alert) => {
          const name = alertClusterName(alert)
          const current = groups[name] ?? { name, alerts: [] as IntelligenceAlert[] }
          current.alerts.push(alert)
          groups[name] = current
          return groups
        },
        {} as Record<string, { name: string; alerts: IntelligenceAlert[] }>,
      ),
    )
      .map((group) => {
        const ids = group.alerts.map((alert) => alert.id)
        return {
          ...group,
          ids,
          patientId: resolveAlertPatientId(group.alerts[0]),
          state: aggregateAlertState(ids, alertStates),
        }
      })
      .sort((left, right) => right.alerts.length - left.alerts.length)

    return (
      <>
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <Surface>
            <SectionHeader
              eyebrow={meta.emphasis}
              title="Escalation queue"
              description="Alerts are grouped into clinical problems so teams can acknowledge, assign, and escalate without duplicate noise."
            />
            <div className="mt-5 space-y-4">
              {groupedAlerts.length ? (
                groupedAlerts.map((group) => {
                  const stateClass =
                    group.state === "Escalated"
                      ? "bg-rose-100 text-rose-800"
                      : group.state === "Acknowledged"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"

                  return (
                    <div key={group.name} className="rounded-[24px] border border-slate-200 bg-white p-5">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-base font-semibold text-slate-900">{group.name}</div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {group.alerts.length} signals
                            </span>
                            <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", stateClass)}>
                              {group.state}
                            </span>
                          </div>
                          <div className="text-sm leading-6 text-slate-600">{group.alerts[0]?.description}</div>
                          <div className="flex flex-wrap gap-2">
                            {group.alerts.map((alert) => (
                              <span
                                key={alert.id}
                                className={cn("rounded-full px-3 py-1 text-xs font-medium", severityClass(alert.severity))}
                              >
                                {alert.title}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <AgentPill agent={group.alerts[0]?.agent ?? "Doctor Agent"} />
                            <span>Latest update: {group.alerts[0]?.time}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-full border-slate-200 bg-white text-slate-700"
                            onClick={() => updateAlertState(group.ids, "Acknowledged")}
                          >
                            Acknowledge
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-full border-slate-200 bg-white text-slate-700"
                            onClick={() => {
                              if (group.patientId) startTransition(() => onSelectPatient(group.patientId))
                            }}
                          >
                            Assign
                          </Button>
                          <Button
                            type="button"
                            className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                            onClick={() => {
                              updateAlertState(group.ids, "Escalated")
                              if (group.patientId) startTransition(() => onSelectPatient(group.patientId))
                            }}
                          >
                            Escalate
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
                  No critical alerts right now. System stable across all wards.
                </div>
              )}
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
                <div key={point} className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600">
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
          onQuickPrompt={sendQuickPrompt}
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
                <div key={route.label} className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-slate-900">{route.label}</div>
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
                  onClick={() => sendQuickPrompt(prompt)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-cyan-200 hover:text-slate-900"
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
              <div key={decision.patient} className="rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-medium text-slate-900">{decision.patient}</div>
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800">
                    {decision.confidence}
                  </span>
                </div>
                <div className="mt-3 text-base font-medium text-slate-900">{decision.diagnosis}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">Why: {decision.why}</div>
                <div className="mt-4 rounded-[18px] bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
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
              <div key={item.patient} className="rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-base font-medium text-slate-900">{item.label}</div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                    {item.status}
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-700">{item.patient}</div>
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
              <div key={item.pair} className="rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-base font-medium text-slate-900">{item.pair}</div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      item.severity === "Critical"
                        ? "bg-rose-100 text-rose-900"
                        : item.severity === "High"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-cyan-100 text-cyan-900",
                    )}
                  >
                    {item.severity}
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-700">{item.patient}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">{item.why}</div>
                <div className="mt-4 rounded-[18px] bg-amber-50 px-4 py-3 text-sm text-amber-900">
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
              <div key={signal.label} className="rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="text-sm text-slate-400">{signal.label}</div>
                <div className="mt-2 text-3xl font-semibold text-slate-900">{signal.value}</div>
                <div className="mt-3 text-sm leading-6 text-slate-400">{signal.detail}</div>
                <div className="mt-4 rounded-[18px] bg-violet-50 px-4 py-3 text-sm text-violet-900">
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
          <div className="mt-6 rounded-[22px] border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600">
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
              <div className="rounded-[22px] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                ER arrivals are above baseline, ICU capacity is protected but thin, and one float nurse reassignment is recommended.
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
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
                  <label key={item} className="flex items-start gap-3 rounded-[22px] border border-slate-200 bg-white p-4">
                    <input defaultChecked={index !== 2} type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-cyan-400" />
                    <span className="text-sm leading-6 text-slate-600">{item}</span>
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

  if (slug === "imaging-monitoring") {
    const accentMap: Record<string, string> = {
      cyan:    "bg-cyan-100 text-cyan-800 ring-1 ring-inset ring-cyan-200",
      amber:   "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200",
      rose:    "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200",
      violet:  "bg-violet-100 text-violet-800 ring-1 ring-inset ring-violet-200",
      emerald: "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200",
    }
    const accentBarMap: Record<string, string> = {
      cyan:    "bg-cyan-400",
      amber:   "bg-amber-400",
      rose:    "bg-rose-400",
      violet:  "bg-violet-400",
      emerald: "bg-emerald-400",
    }
    const catClass: Record<string, string> = {
      Radiology:  "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200",
      Cardiac:    "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
      Monitoring: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    }

    return (
      <>
        {/* Hero stats */}
        <SectionHeader
          eyebrow={meta.eyebrow}
          title={meta.label}
          description={meta.description}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SmallMetric label="Modalities Connected" value="7" note="MRI, CT, Mammogram, X-Ray, US, ECHO, ECG — all wired into the AI OS" />
          <SmallMetric label="Studies Today (sim.)" value={`${imagingModalities.reduce((s, m) => s + m.throughput, 0)}`} note="Aggregate throughput across all active imaging units" />
          <SmallMetric label="AI Flags Raised" value={`${Math.round(imagingModalities.reduce((s, m) => s + m.aiFlag, 0) / imagingModalities.length)}% avg`} note="Percentage of studies triggering an agent-level finding flag" />
          <SmallMetric label="AI Doctor Status" value="Active" note="Multi-modal consultant agent running on all patient timelines" />
        </div>

        {/* Modality cards */}
        <Surface>
          <SectionHeader
            eyebrow="Imaging infrastructure"
            title="Hospital imaging modalities"
            description="Each modality is directly wired into the multi-agent OS via structured events, consuming agents, and explainable outputs."
          />
          <div className="mt-6 space-y-4">
            {imagingModalities.map((modality) => (
              <div key={modality.id} className="rounded-[24px] border border-slate-200 bg-white p-5 transition hover:shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full px-3 py-1 text-[11px] font-semibold", accentMap[modality.accentColor])}>
                        {modality.shortName}
                      </span>
                      <span className={cn("rounded-full px-3 py-1 text-[11px] font-medium", catClass[modality.category])}>
                        {modality.category}
                      </span>
                    </div>
                    <div className="mt-3 text-base font-semibold text-slate-900">{modality.name}</div>
                    <div className="mt-1 text-[11px] font-medium uppercase tracking-widest text-slate-400">{modality.specs}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{modality.description}</p>
                  </div>
                  <div className="lg:w-64 shrink-0 grid gap-3">
                    <div className="rounded-[20px] bg-slate-50 border border-slate-200 p-4">
                      <div className="text-[11px] uppercase tracking-widest text-slate-400">Throughput / day</div>
                      <div className="mt-2 text-2xl font-bold text-slate-900">{modality.throughput}</div>
                      <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                        <div className={cn("h-1.5 rounded-full", accentBarMap[modality.accentColor])} style={{ width: `${Math.min(100, modality.throughput / 1.5)}%` }} />
                      </div>
                    </div>
                    <div className="rounded-[20px] bg-slate-50 border border-slate-200 p-4">
                      <div className="text-[11px] uppercase tracking-widest text-slate-400">AI flag rate</div>
                      <div className="mt-2 text-2xl font-bold text-slate-900">{modality.aiFlag}%</div>
                      <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                        <div className={cn("h-1.5 rounded-full", accentBarMap[modality.accentColor])} style={{ width: `${modality.aiFlag * 2}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-3">AI OS Integration</div>
                    <p className="text-sm leading-6 text-slate-600">{modality.aiIntegration}</p>
                    <div className="mt-4 space-y-2">
                      <div className="text-[11px] uppercase tracking-widest text-slate-400">Event topic</div>
                      <code className="block rounded-[12px] bg-slate-900 text-cyan-300 px-4 py-2 text-xs font-mono">
                        {modality.eventTopic}
                      </code>
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-3">Consuming agents</div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {modality.consumingAgents.map((agent) => (
                        <span key={agent} className="rounded-full bg-cyan-50 text-cyan-800 ring-1 ring-inset ring-cyan-200 px-3 py-1 text-xs font-medium">
                          {agent}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-2">Output</div>
                    <div className="text-sm leading-6 text-slate-600">{modality.outputSummary}</div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <span>Avg turnaround:</span>
                      <span className="font-semibold text-slate-700">{modality.avgTurnaround}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        {/* Charts row */}
        <div className="grid gap-5 xl:grid-cols-2">
          <TrendCard
            title="Daily study throughput by modality"
            subtitle="Simulated volume across all imaging units — higher X-Ray and ECG volumes are expected"
            color="#22d3ee"
            data={imagingThroughputData}
            dataKey="value"
            kind="bar"
            compact
          />
          <TrendCard
            title="AI flag rate by modality (%)"
            subtitle="Percentage of studies that raise a Diagnostics Orchestrator Agent flag for review"
            color="#a78bfa"
            data={imagingAiFlagData}
            dataKey="value"
            kind="bar"
            compact
          />
        </div>

        {/* AI Doctor section */}
        <Surface>
          <SectionHeader
            eyebrow="Intelligent consultant"
            title="AI Doctor — always-available clinical co-pilot"
            description="Built on top of all imaging and monitoring sources as part of the multi-agent hospital OS. The AI Doctor does not replace clinicians — it acts as an explainable, safety-checked co-pilot."
          />

          {/* Data sources table */}
          <div className="mt-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-3">What the AI Doctor reads</div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {aiDoctorDataSources.map((src) => (
                <div key={src.label} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">{src.label}</div>
                  <div className="mt-1 text-sm text-slate-400">{src.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="mt-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-3">Capabilities</div>
            <div className="grid gap-4 lg:grid-cols-2">
              {aiDoctorCapabilities.map((cap) => (
                <div key={cap.id} className="rounded-[24px] border border-slate-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-base font-semibold text-slate-900">{cap.title}</div>
                    <span className="shrink-0 rounded-full bg-cyan-100 text-cyan-800 ring-1 ring-inset ring-cyan-200 px-3 py-1 text-[11px] font-medium">
                      {cap.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{cap.description}</p>
                  <div className="mt-4 rounded-[18px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                    {cap.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explainable output bundle preview */}
          <div className="mt-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-3">Explainable output bundle</div>
            <div className="rounded-[20px] bg-slate-900 p-5 text-xs text-slate-300 font-mono leading-7 overflow-x-auto">
              <span className="text-slate-500">{"{"}</span>{"\n"}
              {"  "}<span className="text-cyan-300">"summary"</span>: <span className="text-emerald-300">"Elevated troponin + irregular ECG + CT findings suggest ACS — escalation recommended"</span>,{"\n"}
              {"  "}<span className="text-cyan-300">"recommendations"</span>: [{"\n"}
              {"    {"} <span className="text-cyan-300">"action"</span>: <span className="text-emerald-300">"Cardiology consult + repeat ECG in 30 min"</span>, <span className="text-cyan-300">"priority"</span>: <span className="text-amber-300">"high"</span>, <span className="text-cyan-300">"requiredApprover"</span>: <span className="text-emerald-300">"doctor"</span> {"}"}
              {"\n  }],"}{"\n"}
              {"  "}<span className="text-cyan-300">"evidence"</span>: [{"{ "}<span className="text-cyan-300">"source"</span>: <span className="text-emerald-300">"ESC-ACS-2023"</span>, <span className="text-cyan-300">"relevance"</span>: <span className="text-amber-300">0.94</span>{" }"}]{",\n"}
              {"  "}<span className="text-cyan-300">"safety"</span>: {"{ "}<span className="text-cyan-300">"contraindications"</span>: [<span className="text-emerald-300">"Aspirin allergy on record"</span>], <span className="text-cyan-300">"uncertainty"</span>: <span className="text-amber-300">0.18</span>{" }"}{",\n"}
              {"  "}<span className="text-cyan-300">"audit"</span>: {"{ "}<span className="text-cyan-300">"modelVersion"</span>: <span className="text-emerald-300">"DCA-v2.4"</span>, <span className="text-cyan-300">"promptVersion"</span>: <span className="text-emerald-300">"cardiac-v1.2"</span>{" }"}
              {"\n"}<span className="text-slate-500">{"}"}</span>
            </div>
          </div>
        </Surface>

        {/* Agent interaction flow */}
        <Surface>
          <SectionHeader
            eyebrow="Agent interaction map"
            title="How imaging data flows through the AI OS"
            description="Imaging and monitoring sources trigger event-driven pipelines that route through specialised agents before any recommendation reaches a clinician."
          />
          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {[
              {
                step: "1 — Imaging event emitted",
                agents: ["DOA Ingests"],
                detail: "A completed study emits order.imaging.resulted with modality tag. The Diagnostics Orchestrator Agent queues it, runs AI screening, and routes structured findings.",
                color: "bg-cyan-50 border-cyan-200",
                badge: "bg-cyan-100 text-cyan-800",
              },
              {
                step: "2 — Specialist agents activated",
                agents: ["SDA", "Cardiac Risk", "NMA"],
                detail: "Depending on modality and acuity, Sepsis/Deterioration, Cardiac Risk, or Nurse Monitoring Agents enrich findings with vitals, labs, and trend context.",
                color: "bg-violet-50 border-violet-200",
                badge: "bg-violet-100 text-violet-800",
              },
              {
                step: "3 — AI Doctor synthesises",
                agents: ["DCA → DSA → QGA"],
                detail: "The Doctor Co-Pilot Agent synthesises the full evidence bundle, Drug Safety checks for contraindications, and Quality Governance validates before surfacing to the clinician.",
                color: "bg-emerald-50 border-emerald-200",
                badge: "bg-emerald-100 text-emerald-800",
              },
            ].map((block) => (
              <div key={block.step} className={cn("rounded-[24px] border p-5", block.color)}>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">{block.step}</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {block.agents.map((a) => (
                    <span key={a} className={cn("rounded-full px-3 py-1 text-xs font-semibold", block.badge)}>{a}</span>
                  ))}
                </div>
                <p className="text-sm leading-6 text-slate-600">{block.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[20px] border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-500">
            <span className="font-semibold text-rose-700">Safety guarantee:</span> The AI Doctor acts strictly as a decision-support tool. It never initiates treatment autonomously. All recommendations carry uncertainty scores, evidence citations, and require explicit clinician sign-off before any clinical action is taken.
          </div>
        </Surface>
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
                <div className="text-lg font-semibold text-slate-900">{model.name}</div>
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
            <div key={step} className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600">
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
