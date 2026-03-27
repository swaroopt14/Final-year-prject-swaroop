export type PageSlug =
  | "dashboard"
  | "patients"
  | "alerts"
  | "ai-insights"
  | "chat-assistant"
  | "doctor-agent"
  | "nurse-agent"
  | "drug-agent"
  | "admin-agent"
  | "predictions"
  | "vitals-trends"
  | "hospital-load"
  | "settings"
  | "logs"
  | "model-insights";

export type AgentName = "Doctor Agent" | "Nurse Agent" | "Drug Agent" | "Admin Agent";

export type NavItem = {
  slug: PageSlug;
  label: string;
  section: "Main" | "Agents" | "Analytics" | "System";
  icon: string;
  liveBadge?: string;
};

export type PatientRecord = {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  age: number;
  sex: "M" | "F";
  ward: string;
  room: string;
  status: "Critical" | "Watch" | "Stable" | "Improving";
  riskScore: number;
  lastUpdated: string;
  assignedAgent: AgentName;
  summary: string;
  reason: string;
  diagnosis: string;
  confidence: number;
  model: string;
  medications: string[];
  allergies: string[];
  vitals: {
    heartRateBpm: number;
    spo2Pct: number;
    systolicMmHg: number;
    diastolicMmHg: number;
    temperatureC: number;
  };
  trends: {
    heartRate: number[];
    spo2: number[];
    risk: number[];
  };
  timeline: string[];
};

export type IntelligenceAlert = {
  id: string;
  title: string;
  description: string;
  severity: "Critical" | "High" | "Medium";
  agent: AgentName;
  patientId?: string;
  tag: string;
  time: string;
};

export type InsightCard = {
  id: string;
  type: "Critical" | "Diagnosis" | "State" | "Drug" | "Admin";
  title: string;
  summary: string;
  explanation: string;
  confidence: number;
  agent: AgentName;
  accent: "red" | "cyan" | "emerald" | "amber" | "violet";
};

export type MetricCard = {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: "critical" | "warning" | "good" | "info";
  note: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  agent?: AgentName;
  body: string;
};

export type ModelRegistryItem = {
  id: string;
  name: string;
  purpose: string;
  version: string;
  status: "Healthy" | "Monitoring" | "Needs Review";
  accuracy: string;
  drift: string;
  owner: AgentName;
};

export type LogItem = {
  id: string;
  level: "Critical" | "Warning" | "Info";
  service: string;
  summary: string;
  detail: string;
  at: string;
};

export const navigationItems: NavItem[] = [
  { slug: "dashboard", label: "Dashboard", section: "Main", icon: "dashboard" },
  { slug: "patients", label: "Patients", section: "Main", icon: "patients" },
  { slug: "alerts", label: "Alerts", section: "Main", icon: "alerts", liveBadge: "LIVE" },
  { slug: "ai-insights", label: "AI Insights", section: "Main", icon: "insights" },
  { slug: "chat-assistant", label: "Chat Assistant", section: "Main", icon: "chat" },
  { slug: "doctor-agent", label: "Doctor Agent", section: "Agents", icon: "doctor" },
  { slug: "nurse-agent", label: "Nurse Agent", section: "Agents", icon: "nurse" },
  { slug: "drug-agent", label: "Drug Agent", section: "Agents", icon: "drug" },
  { slug: "admin-agent", label: "Admin Agent", section: "Agents", icon: "admin" },
  { slug: "predictions", label: "Predictions", section: "Analytics", icon: "predictions" },
  { slug: "vitals-trends", label: "Vitals Trends", section: "Analytics", icon: "vitals" },
  { slug: "hospital-load", label: "Hospital Load", section: "Analytics", icon: "load" },
  { slug: "settings", label: "Settings", section: "System", icon: "settings" },
  { slug: "logs", label: "Logs", section: "System", icon: "logs" },
  { slug: "model-insights", label: "Model Insights", section: "System", icon: "models" }
];

export const pageMeta: Record<
  PageSlug,
  { label: string; eyebrow: string; description: string; emphasis: string }
> = {
  dashboard: {
    label: "Dashboard",
    eyebrow: "AI Decision Operating System",
    description: "One calm surface for real-time alerts, patient risk, agent decisions, and hospital intelligence.",
    emphasis: "Command overview"
  },
  patients: {
    label: "Patients",
    eyebrow: "Patient Intelligence Workspace",
    description: "Filter the cohort, inspect each patient, and review the active agent recommendation in context.",
    emphasis: "Cohort triage"
  },
  alerts: {
    label: "Alerts",
    eyebrow: "Real-Time Triage Center",
    description: "Escalations are grouped by severity, agent owner, and response status so teams can act fast.",
    emphasis: "Incident response"
  },
  "ai-insights": {
    label: "AI Insights",
    eyebrow: "Explainable Intelligence Gallery",
    description: "Every card answers what happened, why it happened, and which agent produced the recommendation.",
    emphasis: "Explainability first"
  },
  "chat-assistant": {
    label: "Chat Assistant",
    eyebrow: "Multi-Agent Assistant",
    description: "Ask natural language questions and route them to the right specialist agent with structured answers.",
    emphasis: "Conversational workflow"
  },
  "doctor-agent": {
    label: "Doctor Agent",
    eyebrow: "Diagnosis & Decision Support",
    description: "Review predicted conditions, evidence factors, and recommended next steps before clinical sign-off.",
    emphasis: "Diagnostic reasoning"
  },
  "nurse-agent": {
    label: "Nurse Agent",
    eyebrow: "Live Monitoring Command",
    description: "Track bedside vitals, device health, and escalation tasks with very low cognitive load.",
    emphasis: "Bedside awareness"
  },
  "drug-agent": {
    label: "Drug Agent",
    eyebrow: "Medication Safety Engine",
    description: "Surface interaction risks, dosage adjustments, and allergy conflicts before they cause harm.",
    emphasis: "Safety guardrails"
  },
  "admin-agent": {
    label: "Admin Agent",
    eyebrow: "Operational Control Tower",
    description: "Watch capacity, staffing, throughput, and emergency readiness from one AI-guided operations view.",
    emphasis: "Resource orchestration"
  },
  predictions: {
    label: "Predictions",
    eyebrow: "Predictive Analytics Lab",
    description: "Forecast deterioration, ICU demand, and readmission risk with model outputs teams can trust.",
    emphasis: "Forward-looking risk"
  },
  "vitals-trends": {
    label: "Vitals Trends",
    eyebrow: "Streaming Physiology View",
    description: "See smooth curves, anomalies, and trend shifts across heart rate, oxygen, pressure, and temperature.",
    emphasis: "Trend intelligence"
  },
  "hospital-load": {
    label: "Hospital Load",
    eyebrow: "Capacity Intelligence",
    description: "Understand occupancy, staffing pressure, and patient flow before bottlenecks become crises.",
    emphasis: "Capacity balance"
  },
  settings: {
    label: "Settings",
    eyebrow: "System Preferences",
    description: "Tune routing thresholds, notification behavior, and operator preferences across the AI OS.",
    emphasis: "Operational control"
  },
  logs: {
    label: "Logs",
    eyebrow: "Audit & Event History",
    description: "Inspect every alert, routing event, and system action in a clear chronological trail.",
    emphasis: "Accountability trail"
  },
  "model-insights": {
    label: "Model Insights",
    eyebrow: "Model Registry & Drift",
    description: "Track model quality, drift, retraining signals, and feedback loop health across the platform.",
    emphasis: "Model governance"
  }
};

export const patients: PatientRecord[] = [
  {
    id: "p_001",
    mrn: "MRN-000145",
    firstName: "Aarav",
    lastName: "Patil",
    age: 42,
    sex: "M",
    ward: "ICU South",
    room: "304-B",
    status: "Critical",
    riskScore: 82,
    lastUpdated: "2 min ago",
    assignedAgent: "Doctor Agent",
    summary: "Sepsis risk remains elevated with low oxygen saturation and persistent fever.",
    reason: "High WBC, fever, low systolic pressure, and a downward SpO2 trend in the last 6 hours.",
    diagnosis: "Sepsis with suspected pneumonia",
    confidence: 0.82,
    model: "Random Forest v2.4",
    medications: ["Warfarin", "Aspirin", "Piperacillin"],
    allergies: ["Penicillin"],
    vitals: { heartRateBpm: 118, spo2Pct: 90, systolicMmHg: 92, diastolicMmHg: 58, temperatureC: 39.1 },
    trends: {
      heartRate: [102, 106, 104, 108, 110, 112, 115, 118],
      spo2: [95, 94, 94, 93, 93, 92, 91, 90],
      risk: [54, 58, 60, 66, 71, 75, 79, 82]
    },
    timeline: [
      "Nurse Agent flagged oxygen drop below 92%.",
      "Doctor Agent recalculated sepsis probability to 82%.",
      "Drug Agent detected penicillin allergy mismatch.",
      "Admin Agent reserved one ICU transfer bed."
    ]
  },
  {
    id: "p_002",
    mrn: "MRN-000321",
    firstName: "Sara",
    lastName: "Sharma",
    age: 33,
    sex: "F",
    ward: "Pulmonary",
    room: "112-A",
    status: "Improving",
    riskScore: 34,
    lastUpdated: "6 min ago",
    assignedAgent: "Doctor Agent",
    summary: "Pneumonia risk is tapering down after antibiotic response and stable vitals.",
    reason: "Respiratory rate normalized, WBC reduced, and temperature has dropped for two consecutive checks.",
    diagnosis: "Community acquired pneumonia",
    confidence: 0.76,
    model: "Logistic Regression v1.9",
    medications: ["Azithromycin", "Paracetamol"],
    allergies: ["None"],
    vitals: { heartRateBpm: 88, spo2Pct: 96, systolicMmHg: 118, diastolicMmHg: 76, temperatureC: 37.1 },
    trends: {
      heartRate: [98, 96, 94, 92, 90, 90, 89, 88],
      spo2: [93, 94, 94, 95, 95, 96, 96, 96],
      risk: [58, 54, 50, 46, 42, 39, 36, 34]
    },
    timeline: [
      "Doctor Agent reduced escalation priority from high to medium.",
      "Nurse Agent marked sputum trend as improving.",
      "Drug Agent confirmed current regimen is safe."
    ]
  },
  {
    id: "p_003",
    mrn: "MRN-000778",
    firstName: "Imran",
    lastName: "Khan",
    age: 49,
    sex: "M",
    ward: "Cardiac",
    room: "218-C",
    status: "Watch",
    riskScore: 61,
    lastUpdated: "1 min ago",
    assignedAgent: "Nurse Agent",
    summary: "Arrhythmia watch remains active after repeated elevated heart-rate episodes overnight.",
    reason: "Heart rate spikes above 120 bpm, borderline blood pressure, and a moderate fatigue score from nursing notes.",
    diagnosis: "Atrial fibrillation observation",
    confidence: 0.68,
    model: "XGBoost v3.1",
    medications: ["Metoprolol", "Furosemide"],
    allergies: ["Sulfa"],
    vitals: { heartRateBpm: 124, spo2Pct: 93, systolicMmHg: 101, diastolicMmHg: 64, temperatureC: 37.8 },
    trends: {
      heartRate: [96, 98, 101, 108, 111, 116, 120, 124],
      spo2: [95, 95, 95, 94, 94, 94, 93, 93],
      risk: [40, 44, 48, 51, 55, 57, 59, 61]
    },
    timeline: [
      "Nurse Agent moved patient to continuous telemetry.",
      "Doctor Agent requested repeat ECG in 30 minutes.",
      "Admin Agent prioritized cardiac technician support."
    ]
  },
  {
    id: "p_004",
    mrn: "MRN-000812",
    firstName: "Nisha",
    lastName: "Rao",
    age: 57,
    sex: "F",
    ward: "Oncology",
    room: "410-D",
    status: "Stable",
    riskScore: 28,
    lastUpdated: "9 min ago",
    assignedAgent: "Drug Agent",
    summary: "Medication schedule is on track and neutropenic precautions remain stable.",
    reason: "No fever, no interaction warnings, and infusion tolerance has remained within expected bounds.",
    diagnosis: "Post-chemotherapy monitoring",
    confidence: 0.73,
    model: "Clinical Rules v4.0",
    medications: ["Ondansetron", "Filgrastim"],
    allergies: ["NSAIDs"],
    vitals: { heartRateBpm: 82, spo2Pct: 98, systolicMmHg: 122, diastolicMmHg: 80, temperatureC: 36.8 },
    trends: {
      heartRate: [84, 84, 83, 84, 83, 82, 82, 82],
      spo2: [98, 98, 99, 98, 98, 98, 98, 98],
      risk: [31, 31, 30, 30, 29, 29, 28, 28]
    },
    timeline: [
      "Drug Agent approved dose timing after renal review.",
      "Nurse Agent completed infusion checkpoint.",
      "Doctor Agent maintained routine monitoring plan."
    ]
  },
  {
    id: "p_005",
    mrn: "MRN-000956",
    firstName: "Dev",
    lastName: "Menon",
    age: 65,
    sex: "M",
    ward: "Emergency",
    room: "ER-07",
    status: "Critical",
    riskScore: 79,
    lastUpdated: "Just now",
    assignedAgent: "Admin Agent",
    summary: "Emergency admission requires ICU coordination because capacity and staffing are both constrained.",
    reason: "Rising lactate, low blood pressure, and no immediate ICU bed assignment in the primary unit.",
    diagnosis: "Shock pathway pending confirmation",
    confidence: 0.74,
    model: "Gradient Boosting v2.2",
    medications: ["Norepinephrine", "Ceftriaxone"],
    allergies: ["None"],
    vitals: { heartRateBpm: 122, spo2Pct: 91, systolicMmHg: 88, diastolicMmHg: 54, temperatureC: 38.4 },
    trends: {
      heartRate: [108, 110, 112, 115, 117, 120, 121, 122],
      spo2: [95, 95, 94, 94, 93, 92, 92, 91],
      risk: [50, 54, 57, 61, 67, 71, 75, 79]
    },
    timeline: [
      "Admin Agent opened emergency bed allocation workflow.",
      "Doctor Agent requested vasopressor bundle.",
      "Nurse Agent escalated pressure drop on the live feed."
    ]
  },
  {
    id: "p_006",
    mrn: "MRN-001114",
    firstName: "Meera",
    lastName: "Joshi",
    age: 28,
    sex: "F",
    ward: "Maternity",
    room: "M-12",
    status: "Stable",
    riskScore: 18,
    lastUpdated: "14 min ago",
    assignedAgent: "Nurse Agent",
    summary: "Post-operative monitoring is smooth with no active alarms.",
    reason: "Normal oxygen, controlled pain score, and no postpartum hemorrhage signals from the monitoring stack.",
    diagnosis: "Post C-section recovery",
    confidence: 0.8,
    model: "Clinical Rules v4.0",
    medications: ["Ibuprofen", "Oxytocin"],
    allergies: ["Latex"],
    vitals: { heartRateBpm: 76, spo2Pct: 99, systolicMmHg: 114, diastolicMmHg: 72, temperatureC: 36.7 },
    trends: {
      heartRate: [82, 81, 80, 79, 78, 78, 77, 76],
      spo2: [98, 98, 98, 99, 99, 99, 99, 99],
      risk: [24, 24, 22, 21, 20, 20, 19, 18]
    },
    timeline: [
      "Nurse Agent closed one low-priority mobility reminder.",
      "Drug Agent confirmed no lactation-related interaction risks."
    ]
  }
];

export const streamPatients = patients.map((patient) => ({
  _id: patient.id,
  mrn: patient.mrn,
  firstName: patient.firstName,
  lastName: patient.lastName,
  dateOfBirth: `19${60 + patient.age}-01-01`,
  sex: patient.sex,
  comorbidities: patient.medications
}));

export const metricCards: MetricCard[] = [
  {
    id: "critical",
    label: "Critical Patients",
    value: "12",
    delta: "+3 today",
    tone: "critical",
    note: "Doctor and Nurse agents agree on 4 urgent escalations."
  },
  {
    id: "hr",
    label: "Avg Heart Rate",
    value: "98 bpm",
    delta: "Slightly high",
    tone: "warning",
    note: "Cardiac ward drift increased after midnight."
  },
  {
    id: "alerts",
    label: "Active Alerts",
    value: "27",
    delta: "Live feed",
    tone: "critical",
    note: "7 alerts are pending acknowledgement."
  },
  {
    id: "drug",
    label: "Drug Conflicts",
    value: "5",
    delta: "High severity",
    tone: "warning",
    note: "Three anticoagulant conflicts need review."
  },
  {
    id: "icu",
    label: "ICU Availability",
    value: "3 beds",
    delta: "Critical",
    tone: "info",
    note: "Admin Agent recommends protected bed reserve."
  },
  {
    id: "response",
    label: "Response Time",
    value: "-32%",
    delta: "Improved",
    tone: "good",
    note: "Average triage-to-action time improved this week."
  }
];

export const criticalAlerts: IntelligenceAlert[] = [
  {
    id: "a1",
    title: "Sepsis Risk: 82%",
    description: "Aarav Patil shows fever, low blood pressure, and SpO2 decline across the last 6 hours.",
    severity: "Critical",
    agent: "Doctor Agent",
    patientId: "p_001",
    tag: "Requires ICU review",
    time: "Now"
  },
  {
    id: "a2",
    title: "Oxygen Dropped Below 90%",
    description: "Dev Menon triggered a sustained oxygen dip with simultaneous heart-rate acceleration.",
    severity: "Critical",
    agent: "Nurse Agent",
    patientId: "p_005",
    tag: "Bedside escalation",
    time: "1 min ago"
  },
  {
    id: "a3",
    title: "Drug Conflict: Aspirin + Warfarin",
    description: "High bleed-risk combination detected against the current anticoagulation pathway.",
    severity: "High",
    agent: "Drug Agent",
    patientId: "p_001",
    tag: "Medication block",
    time: "4 min ago"
  },
  {
    id: "a4",
    title: "ICU Capacity Threshold Reached",
    description: "Only three protected ICU beds remain after emergency admission routing.",
    severity: "High",
    agent: "Admin Agent",
    tag: "Operations watch",
    time: "8 min ago"
  }
];

export const insightCards: InsightCard[] = [
  {
    id: "i1",
    type: "Critical",
    title: "Sepsis Probability 82%",
    summary: "Immediate ICU attention recommended.",
    explanation: "High WBC, fever 39.1C, low systolic pressure, and oxygen decline are driving the score.",
    confidence: 0.82,
    agent: "Doctor Agent",
    accent: "red"
  },
  {
    id: "i2",
    type: "Diagnosis",
    title: "Predicted Pneumonia 76%",
    summary: "Condition is improving under current antibiotics.",
    explanation: "Cough, elevated temperature, and prior WBC pattern remain the strongest features.",
    confidence: 0.76,
    agent: "Doctor Agent",
    accent: "cyan"
  },
  {
    id: "i3",
    type: "State",
    title: "Vitals Trend: Improving",
    summary: "Respiratory distress markers are tapering down.",
    explanation: "SpO2 rose from 93% to 96% while temperature normalized over two checks.",
    confidence: 0.71,
    agent: "Nurse Agent",
    accent: "emerald"
  },
  {
    id: "i4",
    type: "Drug",
    title: "Bleed Risk Conflict",
    summary: "Aspirin plus Warfarin should be reviewed before next dose.",
    explanation: "Anticoagulant overlap and current platelet trend elevate the likelihood of adverse bleeding.",
    confidence: 0.88,
    agent: "Drug Agent",
    accent: "amber"
  },
  {
    id: "i5",
    type: "Admin",
    title: "Staff Load High In ER",
    summary: "Night shift occupancy crossed the target threshold.",
    explanation: "Emergency arrivals rose 18% while available nurse coverage dropped by one shift slot.",
    confidence: 0.8,
    agent: "Admin Agent",
    accent: "violet"
  },
  {
    id: "i6",
    type: "State",
    title: "ICU Risk Score 79%",
    summary: "Transfer should be coordinated before vasopressor demand rises further.",
    explanation: "Shock indicators, current bed pressure, and acute nurse attention requirements are all elevated.",
    confidence: 0.79,
    agent: "Admin Agent",
    accent: "red"
  }
];

export const chatSeed: ChatMessage[] = [
  {
    id: "c1",
    role: "user",
    body: "Why is Aarav critical?"
  },
  {
    id: "c2",
    role: "assistant",
    agent: "Doctor Agent",
    body: "Aarav is critical because oxygen dropped to 90%, temperature rose to 39.1C, systolic pressure fell to 92 mmHg, and the sepsis model now estimates 82% risk."
  },
  {
    id: "c3",
    role: "assistant",
    agent: "Nurse Agent",
    body: "Bedside trend confirms the decline started about six hours ago, with a steady SpO2 drop and persistent tachycardia."
  }
];

export const predictionSeries = {
  risk: [48, 51, 56, 59, 63, 67, 71, 76, 79, 82],
  hospitalLoad: [68, 66, 70, 74, 72, 77, 81, 80, 83, 85],
  drugInteractions: [1, 2, 1, 3, 2, 4, 5, 3, 4, 5],
  icuDemand: [2, 2, 3, 3, 4, 5, 4, 5, 6, 6]
};

export const predictionBuckets = [
  { label: "Readmission", value: "23%", note: "Likely within 7 days for cardiac watchlist." },
  { label: "ICU Transfer", value: "41%", note: "Driven by shock pathway and sepsis cohort." },
  { label: "Escalation Overrun", value: "18%", note: "Night shift staffing pressure is the main driver." }
];

export const nurseQueue = [
  { label: "Telemetry review", patient: "Imran Khan", status: "Due now", agent: "Nurse Agent", note: "HR stayed above 120 bpm for 9 min." },
  { label: "Pressure recheck", patient: "Dev Menon", status: "Urgent", agent: "Nurse Agent", note: "Systolic trend is still under 90." },
  { label: "Mobility reminder", patient: "Meera Joshi", status: "In progress", agent: "Nurse Agent", note: "Low-priority post-op protocol step." }
];

export const doctorDecisions = [
  { patient: "Aarav Patil", diagnosis: "Sepsis with suspected pneumonia", confidence: "82%", why: "WBC, fever, hypotension, SpO2 decline", action: "Escalate ICU and repeat cultures" },
  { patient: "Sara Sharma", diagnosis: "Pneumonia improving", confidence: "76%", why: "WBC down, temp down, respiratory status better", action: "Continue present regimen" },
  { patient: "Dev Menon", diagnosis: "Shock pathway pending", confidence: "74%", why: "Low pressure, rising lactate, oxygen drop", action: "Bed coordination and vasopressor bundle" }
];

export const drugMatrix = [
  { pair: "Warfarin + Aspirin", severity: "High", patient: "Aarav Patil", why: "Dual anticoagulation bleed risk", action: "Hold aspirin until doctor review" },
  { pair: "Piperacillin + Penicillin Allergy", severity: "Critical", patient: "Aarav Patil", why: "Allergy conflict detected", action: "Swap antibiotic class" },
  { pair: "Metoprolol + Furosemide", severity: "Medium", patient: "Imran Khan", why: "Monitor pressure and dizziness", action: "Keep telemetry active" }
];

export const adminSignals = [
  { label: "ER Occupancy", value: "91%", detail: "Emergency arrivals are outpacing discharges.", action: "Open overflow staffing." },
  { label: "ICU Staffing", value: "86%", detail: "One nurse short for ideal night ratio.", action: "Reassign float pool." },
  { label: "Avg Triage Time", value: "7 min", detail: "Still within target after automation improvements.", action: "Maintain current workflow." }
];

export const logs: LogItem[] = [
  {
    id: "l1",
    level: "Critical",
    service: "event-bus",
    summary: "Emergency escalation broadcast",
    detail: "Shock pathway event was published to doctor, nurse, and admin queues.",
    at: "2026-03-26 08:42"
  },
  {
    id: "l2",
    level: "Warning",
    service: "drug-agent",
    summary: "Medication conflict detected",
    detail: "Warfarin plus aspirin collision raised a high-severity safety gate.",
    at: "2026-03-26 08:38"
  },
  {
    id: "l3",
    level: "Info",
    service: "doctor-agent",
    summary: "Prediction refreshed",
    detail: "Sepsis model score recalculated after lab ingestion.",
    at: "2026-03-26 08:36"
  },
  {
    id: "l4",
    level: "Info",
    service: "admin-agent",
    summary: "Bed reservation updated",
    detail: "Protected ICU capacity changed from four to three beds.",
    at: "2026-03-26 08:30"
  }
];

export const modelRegistry: ModelRegistryItem[] = [
  {
    id: "m1",
    name: "Sepsis RF",
    purpose: "Deterioration and sepsis risk scoring",
    version: "2.4.1",
    status: "Healthy",
    accuracy: "92.4%",
    drift: "Low",
    owner: "Doctor Agent"
  },
  {
    id: "m2",
    name: "Vitals Anomaly Watcher",
    purpose: "Continuous bedside abnormality detection",
    version: "1.8.0",
    status: "Monitoring",
    accuracy: "89.1%",
    drift: "Medium",
    owner: "Nurse Agent"
  },
  {
    id: "m3",
    name: "Medication Safety Rules",
    purpose: "Interaction, allergy, and renal dosing checks",
    version: "4.0.3",
    status: "Healthy",
    accuracy: "Rule based",
    drift: "None",
    owner: "Drug Agent"
  },
  {
    id: "m4",
    name: "Flow Forecast",
    purpose: "Bed load, staffing pressure, and transfer demand",
    version: "3.2.5",
    status: "Needs Review",
    accuracy: "84.7%",
    drift: "High",
    owner: "Admin Agent"
  }
];

export const promptSuggestions = [
  "Why is patient critical?",
  "Show lab abnormalities",
  "Which patients need ICU attention?",
  "Explain the drug conflict",
  "What is hospital load status?"
];

export const settingsGroups = [
  {
    title: "Alert Routing",
    items: [
      "Auto-route critical deterioration to Doctor and Nurse agents",
      "Escalate unresolved alerts after 3 minutes",
      "Mirror drug conflicts to pharmacy supervisor"
    ]
  },
  {
    title: "Explainability",
    items: [
      "Show top three contributing factors on every AI card",
      "Display model version with confidence score",
      "Expose evidence chain in chat answers"
    ]
  },
  {
    title: "Display Preferences",
    items: [
      "Keep dark mode enabled by default",
      "Pin floating chat access on every page",
      "Reduce motion for bedside tablets"
    ]
  }
];
