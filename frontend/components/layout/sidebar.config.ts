export type Role = "doctor" | "nurse" | "admin" | "patient";

export type AgentStatus = "online" | "offline" | "degraded";

export type SidebarBadgeVariant = "count" | "dot";
export type SidebarActiveMatch = "exact" | "prefix";

export type SidebarIconName =
  | "dashboard"
  | "users"
  | "userPlus"
  | "history"
  | "activity"
  | "pulse"
  | "siren"
  | "brain"
  | "stethoscope"
  | "sparkles"
  | "pill"
  | "testTube"
  | "upload"
  | "bot"
  | "scrollText"
  | "barChart"
  | "shield"
  | "settings"
  | "logOut"
  | "message"
  | "fileText"
  | "hospital"
  | "calendar"
  | "database"
  | "workflow"
  | "blocks";

export type SidebarItemConfig = {
  id: string;
  label: string;
  path: string;
  icon?: SidebarIconName;
  activeMatch?: SidebarActiveMatch;
  disabled?: boolean;
  external?: boolean;

  badgeKey?: string;
  badgeVariant?: SidebarBadgeVariant;

  statusKey?: string;
};

export type SidebarGroupConfig = {
  id: string;
  label: string;
  items: SidebarItemConfig[];
};

export const sidebarConfig: Record<Role, SidebarGroupConfig[]> = {
  doctor: [
    {
      id: "dashboard",
      label: "Dashboard",
      items: [
        { id: "doc_overview", label: "Overview", path: "/doctor", icon: "dashboard", activeMatch: "exact" },
        { id: "doc_my_patients", label: "My Patients", path: "/doctor/patients", icon: "users" },
        {
          id: "doc_critical_alerts",
          label: "Critical Alerts",
          path: "/doctor/alerts",
          icon: "siren",
          badgeKey: "critical_alerts",
          badgeVariant: "count"
        }
      ]
    },
    {
      id: "patient_mgmt",
      label: "Patient Management",
      items: [
        { id: "doc_all_patients", label: "All Patients", path: "/doctor/patients/all", icon: "users" },
        { id: "doc_add_patient", label: "Add Patient", path: "/doctor/patients/new", icon: "userPlus" },
        { id: "doc_history", label: "Patient History", path: "/doctor/patients/history", icon: "history" }
      ]
    },
    {
      id: "monitoring",
      label: "Monitoring",
      items: [
        { id: "doc_live_vitals", label: "Live Vitals", path: "/doctor/monitoring/vitals", icon: "pulse" },
        { id: "doc_risk_trends", label: "Risk Score Trends", path: "/doctor/monitoring/risk", icon: "activity" }
      ]
    },
    {
      id: "clinical_intel",
      label: "Clinical Intelligence",
      items: [
        { id: "doc_ai_dx", label: "AI Diagnosis Assistant", path: "/doctor/ai/diagnosis", icon: "brain" },
        { id: "doc_ml_predict", label: "Disease Prediction (ML)", path: "/doctor/ai/predict", icon: "sparkles" },
        { id: "doc_rl_treatment", label: "Treatment Recommendation (RL)", path: "/doctor/ai/treatment", icon: "stethoscope" },
        { id: "doc_bert_notes", label: "Clinical Notes Analyzer (BERT)", path: "/doctor/ai/notes", icon: "scrollText" }
      ]
    },
    {
      id: "medication",
      label: "Medication & Pharmacy",
      items: [
        { id: "doc_prescriptions", label: "Prescriptions", path: "/doctor/pharmacy/prescriptions", icon: "pill" },
        {
          id: "doc_drug_checker",
          label: "Drug Interaction Checker",
          path: "/doctor/pharmacy/drug-check",
          icon: "blocks",
          badgeKey: "drug_alerts",
          badgeVariant: "dot"
        }
      ]
    },
    {
      id: "labs",
      label: "Lab & Reports",
      items: [
        { id: "doc_lab_results", label: "Lab Results", path: "/doctor/labs/results", icon: "testTube" },
        { id: "doc_upload_lab", label: "Upload Lab Report", path: "/doctor/labs/upload", icon: "upload" }
      ]
    },
    {
      id: "agents",
      label: "Agent Control Panel",
      items: [
        {
          id: "doc_agent_logs",
          label: "Doctor Agent Logs",
          path: "/doctor/agents/logs",
          icon: "bot",
          statusKey: "agent_mesh"
        },
        { id: "doc_alert_history", label: "Alert History", path: "/doctor/agents/alerts", icon: "history" }
      ]
    },
    {
      id: "analytics",
      label: "Analytics",
      items: [
        { id: "doc_recovery", label: "Recovery Metrics", path: "/doctor/analytics/recovery", icon: "barChart" },
        { id: "doc_cases", label: "Case Statistics", path: "/doctor/analytics/cases", icon: "barChart" }
      ]
    },
    {
      id: "settings",
      label: "Settings",
      items: [
        { id: "doc_profile", label: "Profile", path: "/doctor/settings/profile", icon: "settings" },
        { id: "doc_logout", label: "Logout", path: "/logout", icon: "logOut", activeMatch: "exact" }
      ]
    }
  ],

  nurse: [
    {
      id: "dashboard",
      label: "Dashboard",
      items: [
        { id: "nurse_overview", label: "Overview", path: "/nurse", icon: "dashboard", activeMatch: "exact" },
        { id: "nurse_assigned", label: "Assigned Patients", path: "/nurse/patients", icon: "users" }
      ]
    },
    {
      id: "monitoring",
      label: "Monitoring",
      items: [
        { id: "nurse_vitals_feed", label: "Live Vitals Feed", path: "/nurse/monitoring/vitals", icon: "pulse" },
        { id: "nurse_iot", label: "IoT Devices", path: "/nurse/monitoring/iot", icon: "activity" },
        {
          id: "nurse_emergency",
          label: "Emergency Alerts",
          path: "/nurse/monitoring/alerts",
          icon: "siren",
          badgeKey: "critical_alerts",
          badgeVariant: "count"
        }
      ]
    },
    {
      id: "patient_mgmt",
      label: "Patient Management",
      items: [
        { id: "nurse_update_vitals", label: "Update Vitals", path: "/nurse/patients/vitals", icon: "activity" },
        { id: "nurse_add_notes", label: "Add Notes", path: "/nurse/patients/notes", icon: "fileText" }
      ]
    },
    {
      id: "agents",
      label: "Agent Control Panel",
      items: [
        {
          id: "nurse_agent_activity",
          label: "Nurse Agent Activity",
          path: "/nurse/agents/activity",
          icon: "bot",
          statusKey: "agent_mesh"
        }
      ]
    },
    {
      id: "medication",
      label: "Medication & Pharmacy",
      items: [
        { id: "nurse_med_schedule", label: "Medication Schedule", path: "/nurse/pharmacy/schedule", icon: "pill" }
      ]
    },
    {
      id: "settings",
      label: "Settings",
      items: [{ id: "nurse_settings", label: "Profile & Settings", path: "/nurse/settings", icon: "settings" }]
    }
  ],

  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      items: [
        { id: "admin_overview", label: "System Overview", path: "/admin", icon: "dashboard", activeMatch: "exact" },
        { id: "admin_agent_health", label: "Agent Health", path: "/admin/agents/health", icon: "bot", statusKey: "agent_mesh" }
      ]
    },
    {
      id: "workflow",
      label: "Hospital Workflow",
      items: [
        { id: "admin_staff", label: "Staff Management", path: "/admin/workflow/staff", icon: "users" },
        { id: "admin_shifts", label: "Shift Scheduling", path: "/admin/workflow/shifts", icon: "calendar" },
        { id: "admin_resources", label: "Resource Allocation", path: "/admin/workflow/resources", icon: "hospital" }
      ]
    },
    {
      id: "integration",
      label: "Data Integration",
      items: [
        { id: "admin_fhir", label: "FHIR Mapping", path: "/admin/integration/fhir", icon: "workflow" },
        { id: "admin_hl7", label: "HL7 Logs", path: "/admin/integration/hl7", icon: "scrollText" }
      ]
    },
    {
      id: "streaming",
      label: "Event Streaming",
      items: [
        { id: "admin_kafka", label: "Kafka Topics", path: "/admin/streaming/kafka", icon: "database" },
        { id: "admin_alert_queue", label: "Alert Queue", path: "/admin/streaming/alerts", icon: "siren", badgeKey: "critical_alerts", badgeVariant: "count" }
      ]
    },
    {
      id: "logs",
      label: "System Logs",
      items: [
        { id: "admin_audit", label: "Audit Trails", path: "/admin/logs/audit", icon: "shield" },
        { id: "admin_blockchain", label: "Blockchain Logs", path: "/admin/logs/blockchain", icon: "blocks" }
      ]
    },
    {
      id: "ai_models",
      label: "AI Models",
      items: [
        { id: "admin_ml_status", label: "ML Model Status", path: "/admin/ai/models", icon: "sparkles" },
        { id: "admin_retrain", label: "Retraining Control", path: "/admin/ai/retrain", icon: "settings" }
      ]
    },
    {
      id: "analytics",
      label: "Analytics",
      items: [
        { id: "admin_perf", label: "Performance Metrics", path: "/admin/analytics/performance", icon: "barChart" },
        { id: "admin_errors", label: "Error Rates", path: "/admin/analytics/errors", icon: "barChart" }
      ]
    },
    {
      id: "settings",
      label: "Settings",
      items: [{ id: "admin_settings", label: "Admin Settings", path: "/admin/settings", icon: "settings" }]
    }
  ],

  patient: [
    {
      id: "dashboard",
      label: "Dashboard",
      items: [
        { id: "pat_overview", label: "My Health Overview", path: "/patient", icon: "dashboard", activeMatch: "exact" }
      ]
    },
    {
      id: "reports",
      label: "Reports",
      items: [
        { id: "pat_labs", label: "Lab Reports", path: "/patient/reports/labs", icon: "testTube" },
        { id: "pat_prescriptions", label: "Prescriptions", path: "/patient/reports/prescriptions", icon: "pill" }
      ]
    },
    {
      id: "monitoring",
      label: "Monitoring",
      items: [{ id: "pat_vitals", label: "My Vitals", path: "/patient/monitoring/vitals", icon: "pulse" }]
    },
    {
      id: "comms",
      label: "Communication",
      items: [
        { id: "pat_messages", label: "Doctor Messages", path: "/patient/messages", icon: "message", badgeKey: "messages", badgeVariant: "count" }
      ]
    },
    {
      id: "settings",
      label: "Settings",
      items: [{ id: "pat_settings", label: "Profile & Settings", path: "/patient/settings", icon: "settings" }]
    }
  ]
};

