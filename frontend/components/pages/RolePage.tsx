"use client";

import { Topbar } from "@/components/layout/Topbar";
import { Badge } from "@/components/ui/Badge";
import type { Role } from "@/components/layout/sidebar.config";
import { AlertCenter } from "@/components/pages/AlertCenter";
import { AgentHealthPanel } from "@/components/pages/AgentHealthPanel";
import { ClinicalIntelligencePanel } from "@/components/pages/ClinicalIntelligencePanel";
import { PatientListPanel } from "@/components/pages/PatientListPanel";
import { RagChatConsole } from "@/components/pages/RagChatConsole";
import { VitalsMonitoringPanel } from "@/components/pages/VitalsMonitoringPanel";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardOverviewPanel } from "@/components/pages/DashboardOverviewPanel";
import { AddPatientPanel } from "@/components/pages/AddPatientPanel";
import { PatientHistoryPanel } from "@/components/pages/PatientHistoryPanel";
import { RiskTrendsPanel } from "@/components/pages/RiskTrendsPanel";
import { AiDiagnosisPage } from "@/components/pages/ai/AiDiagnosisPage";
import { DiseasePredictionPage } from "@/components/pages/ai/DiseasePredictionPage";
import { TreatmentRecommendationPage } from "@/components/pages/ai/TreatmentRecommendationPage";
import { ClinicalNotesAnalyzerPage } from "@/components/pages/ai/ClinicalNotesAnalyzerPage";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useAlerts } from "@/lib/alerts-context";

function titleFor(role: Role, slug?: string[]) {
  const base = role === "doctor" ? "Doctor Console" : role === "nurse" ? "Nurse Station" : role === "admin" ? "Admin Control" : "Patient Portal";
  if (!slug?.length) return base;
  return `${base} • ${slug.join(" / ")}`;
}

function subtitleFor(role: Role) {
  switch (role) {
    case "doctor":
      return "Explainable clinical decision support with real-time monitoring";
    case "nurse":
      return "Live monitoring, triage workflows, and bedside operations";
    case "admin":
      return "Agent health, streaming ops, audit trails, and governance";
    case "patient":
      return "Your health overview, reports, vitals, and messages";
  }
}

function roleBadge(role: Role) {
  return role === "doctor" ? "sky" : role === "nurse" ? "green" : role === "admin" ? "yellow" : "slate";
}

export function RolePage({ role, slug }: { role: Role; slug?: string[] }) {
  const s = slug ?? [];
  const path = s.join("/");
  const alerts = useAlerts();
  const notifCount = alerts.items.filter((i) => i.type === "high_risk_alert" || i.type === "drug_alert").length;

  const showAlerts =
    path === "alerts" ||
    path.endsWith("monitoring/alerts") ||
    path.endsWith("streaming/alerts");

  const showAgentHealth = role === "admin" && (path === "" || path === "agents/health");

  const showClinicalIntel =
    path === "" ||
    path.startsWith("ai/");

  const showPatients = path === "patients" || path.startsWith("patients/");
  const showAddPatient = path === "patients/new";
  const showPatientHistory = path === "patients/history";
  const showAllPatients = path === "patients" || path === "patients/all";

  const showMonitoringVitals =
    path === "monitoring/vitals" ||
    path === "monitoring/vitals-feed" ||
    path.startsWith("monitoring/vitals");

  const showRiskTrends = path === "monitoring/risk";

  const isOverview = path === "";

  return (
    <>
      {isOverview && role === "doctor" ? (
        <DashboardHeader
          title="Welcome back, Doctor 👋"
          subtitle="Here is the latest update for the last 7 days. Check now."
          userName="Doctor"
          notificationCount={notifCount}
        />
      ) : (
        <Topbar
          title={titleFor(role, slug)}
          subtitle={subtitleFor(role)}
          right={
            <div className="flex items-center gap-2">
              <span className="relative inline-flex">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                  </svg>
                </span>
                {notifCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {notifCount > 99 ? "99+" : notifCount}
                  </span>
                ) : null}
              </span>
              <Badge tone={roleBadge(role)}>{role.toUpperCase()}</Badge>
            </div>
          }
        />
      )}

      {isOverview && role === "doctor" ? <DashboardOverviewPanel /> : null}
      {showAgentHealth ? <AgentHealthPanel /> : null}
      {showClinicalIntel && path === "" ? <ClinicalIntelligencePanel roleLabel={role.toUpperCase()} /> : null}
      {path === "ai/diagnosis" ? <AiDiagnosisPage /> : null}
      {path === "ai/predict" ? <DiseasePredictionPage /> : null}
      {path === "ai/treatment" ? <TreatmentRecommendationPage /> : null}
      {path === "ai/notes" ? <ClinicalNotesAnalyzerPage /> : null}
      {path.startsWith("ai/") ? <RagChatConsole title="RAG Chat Console" /> : null}
      {showAlerts ? <AlertCenter title="Alerts & Triage" /> : null}
      {showAllPatients ? <PatientListPanel /> : null}
      {showAddPatient ? <AddPatientPanel /> : null}
      {showPatientHistory ? <PatientHistoryPanel /> : null}
      {showMonitoringVitals ? <VitalsMonitoringPanel /> : null}
      {showRiskTrends ? <RiskTrendsPanel /> : null}

      {role === "doctor" && path === "" ? (
        <Card>
          <CardHeader title="Demo Data Dashboard" subtitle="Existing demo page with seeded patients, vitals, labs, and doctor evaluate workflow" right={<Badge tone="slate">Legacy</Badge>} />
          <CardBody>
            <div className="text-sm text-slate-700">
              Open the current demo dashboard (patients + vitals + labs + agent evaluate) here:
            </div>
            <div className="mt-3">
              <Link className="inline-flex items-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700" href="/dashboard">
                Go to /dashboard
              </Link>
            </div>
          </CardBody>
        </Card>
      ) : null}

      {!showAgentHealth && !showClinicalIntel && !showAlerts && !showPatients && !showMonitoringVitals && !showRiskTrends ? (
        <Card>
          <CardHeader title="Module coming online" subtitle="This route is wired for the sidebar; implement the module UI next." />
          <CardBody>
            <div className="text-sm text-slate-700">
              Path: <span className="font-semibold text-slate-900">/{role}{path ? `/${path}` : ""}</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Next step: connect this view to backend endpoints (RAG evidence bundles, XAI attributions, audit logs).
            </div>
          </CardBody>
        </Card>
      ) : null}
    </>
  );
}
