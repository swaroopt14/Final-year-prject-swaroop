export type PageSlug =
  | "dashboard"
  | "reports"
  | "patients"
  | "patient-registry"
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
  | "model-insights"

export type AgentName = "Doctor Agent" | "Nurse Agent" | "Drug Agent" | "Admin Agent"

export type NavItem = {
  slug: PageSlug
  label: string
  section: "Main" | "Agents" | "Analytics" | "System"
}

export type PatientRecord = {
  id: string
  mrn: string
  firstName: string
  lastName: string
  age: number
  gender: string
  ward: string
  room: string
  status: "Critical" | "Watch" | "Stable" | "Improving"
  riskScore: number
  lastUpdated: string
  assignedAgent: AgentName
  summary: string
  reason: string
  diagnosis: string
  confidence: number
  model: string
  medications: string[]
  allergies: string[]
  medicalHistory: string[]
  visitHistory: string[]
  doctorNotes: string[]
  complaints: string[]
  aiInsight: {
    title: string
    explanation: string
    confidence: number
    agent: AgentName
  }
  prescriptions: Array<{
    drug: string
    dosage: string
    frequency: string
    composition: string
    interaction: string
    allergyWarning: string
    history: string
  }>
  labReports: Array<{
    label: string
    value: string
    status: "Normal" | "Watch" | "High" | "Critical"
  }>
  vitals: {
    heartRateBpm: number
    spo2Pct: number
    systolicMmHg: number
    diastolicMmHg: number
    temperatureC: number
    respiratoryRateRpm: number
    ecgSummary: string
  }
  trends: {
    heartRate: number[]
    spo2: number[]
    risk: number[]
    respiratoryRate: number[]
    temperature: number[]
    ecg: number[]
  }
  timeline: string[]
}

export type IntelligenceAlert = {
  id: string
  title: string
  description: string
  severity: "Critical" | "High" | "Medium"
  agent: AgentName
  tag: string
  time: string
}

export type InsightCard = {
  id: string
  type: "Critical" | "Diagnosis" | "State" | "Drug" | "Admin"
  title: string
  summary: string
  explanation: string
  confidence: number
  agent: AgentName
  accent: "red" | "cyan" | "emerald" | "amber" | "violet"
}

export type MetricCard = {
  id: string
  label: string
  value: string
  delta: string
  tone: "critical" | "warning" | "good" | "info"
  note: string
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  agent?: AgentName
  body: string
  route?: string
}

export type ModelRegistryItem = {
  id: string
  name: string
  purpose: string
  version: string
  status: "Healthy" | "Monitoring" | "Needs Review"
  accuracy: string
  drift: string
  owner: AgentName
}

export type LogItem = {
  id: string
  level: "Critical" | "Warning" | "Info"
  service: string
  summary: string
  detail: string
  at: string
}

export const navigationItems: NavItem[] = [
  { slug: "dashboard", label: "Dashboard", section: "Main" },
  { slug: "reports", label: "Reports", section: "Main" },
  { slug: "patients", label: "Patients", section: "Main" },
  { slug: "patient-registry", label: "Patient Registry", section: "Main" },
  { slug: "alerts", label: "Alerts", section: "Main" },
  { slug: "ai-insights", label: "AI Insights", section: "Main" },
  { slug: "chat-assistant", label: "Chat Assistant", section: "Main" },
  { slug: "doctor-agent", label: "Doctor Agent", section: "Agents" },
  { slug: "nurse-agent", label: "Nurse Agent", section: "Agents" },
  { slug: "drug-agent", label: "Drug Agent", section: "Agents" },
  { slug: "admin-agent", label: "Admin Agent", section: "Agents" },
  { slug: "predictions", label: "Predictions", section: "Analytics" },
  { slug: "vitals-trends", label: "Vitals Trends", section: "Analytics" },
  { slug: "hospital-load", label: "Hospital Load", section: "Analytics" },
  { slug: "settings", label: "Settings", section: "System" },
  { slug: "logs", label: "Logs", section: "System" },
  { slug: "model-insights", label: "Model Insights", section: "System" },
]

export const pageMeta: Record<
  PageSlug,
  { label: string; eyebrow: string; description: string; emphasis: string }
> = {
  dashboard: {
    label: "Dashboard",
    eyebrow: "AI Decision Operating System",
    description: "One calm surface for live patient risk, critical alerts, and agent-led clinical decisions.",
    emphasis: "Command overview",
  },
  reports: {
    label: "Reports",
    eyebrow: "Clinical Report Ingestion",
    description: "Upload, index, and route clinical reports into the multi-agent intelligence system.",
    emphasis: "Document pipeline",
  },
  patients: {
    label: "Patients",
    eyebrow: "Patient Intelligence Workspace",
    description: "Search the cohort, inspect context, and keep the assigned AI recommendation visible.",
    emphasis: "Cohort triage",
  },
  "patient-registry": {
    label: "Patient Registry",
    eyebrow: "Derived Patient Intelligence",
    description: "One table for every patient, with derived AI risk, vitals alerts, drug flags, and trend signals.",
    emphasis: "Cohort intelligence",
  },
  alerts: {
    label: "Alerts",
    eyebrow: "Real-Time Triage Center",
    description: "Escalations grouped by severity, agent owner, and urgency so teams can act quickly.",
    emphasis: "Incident response",
  },
  "ai-insights": {
    label: "AI Insights",
    eyebrow: "Explainable Intelligence Gallery",
    description: "Every card explains what happened, why it happened, and which agent surfaced it.",
    emphasis: "Explainability first",
  },
  "chat-assistant": {
    label: "Chat Assistant",
    eyebrow: "Multi-Agent Assistant",
    description: "Route natural-language questions to the right specialist agent and keep answers structured.",
    emphasis: "Conversational workflow",
  },
  "doctor-agent": {
    label: "Doctor Agent",
    eyebrow: "Diagnosis & Decision Support",
    description: "Review predictions, supporting evidence, and recommended next steps before sign-off.",
    emphasis: "Diagnostic reasoning",
  },
  "nurse-agent": {
    label: "Nurse Agent",
    eyebrow: "Live Monitoring Command",
    description: "A bedside-first console for vitals, queue status, and escalation readiness.",
    emphasis: "Bedside awareness",
  },
  "drug-agent": {
    label: "Drug Agent",
    eyebrow: "Medication Safety Engine",
    description: "Interaction risks, allergy conflicts, and dosage warnings in one safety-focused view.",
    emphasis: "Safety guardrails",
  },
  "admin-agent": {
    label: "Admin Agent",
    eyebrow: "Operational Control Tower",
    description: "Capacity, staff pressure, throughput, and bed management in one AI-guided control view.",
    emphasis: "Resource orchestration",
  },
  predictions: {
    label: "Predictions",
    eyebrow: "Predictive Analytics Lab",
    description: "Forecast deterioration, ICU demand, and operational stress with readable AI output.",
    emphasis: "Forward-looking risk",
  },
  "vitals-trends": {
    label: "Vitals Trends",
    eyebrow: "Streaming Physiology View",
    description: "Smooth curves for HR, SpO2, pressure, and risk movement with clear narrative context.",
    emphasis: "Trend intelligence",
  },
  "hospital-load": {
    label: "Hospital Load",
    eyebrow: "Capacity Intelligence",
    description: "See hospital strain before it becomes chaos and keep the next operational move obvious.",
    emphasis: "Capacity balance",
  },
  settings: {
    label: "Settings",
    eyebrow: "System Preferences",
    description: "Tune routing thresholds, notification behavior, and interface preferences.",
    emphasis: "Operational control",
  },
  logs: {
    label: "Logs",
    eyebrow: "Audit & Event History",
    description: "Inspect every alert, routing event, and system action in a clean operational timeline.",
    emphasis: "Accountability trail",
  },
  "model-insights": {
    label: "Model Insights",
    eyebrow: "Model Registry & Drift",
    description: "Track versioning, drift, quality, and the continuous-learning loop behind the AI system.",
    emphasis: "Model governance",
  },
}

export const patients: PatientRecord[] = [
  {
    id: "p001",
    mrn: "MRN-000145",
    firstName: "Aarav",
    lastName: "Patil",
    age: 42,
    gender: "Male",
    ward: "ICU South",
    room: "304-B",
    status: "Critical",
    riskScore: 82,
    lastUpdated: "2 min ago",
    assignedAgent: "Doctor Agent",
    summary: "Sepsis risk remains elevated with low oxygen saturation and persistent fever.",
    reason: "High WBC, fever 39.1C, low systolic pressure, and a downward SpO2 trend in the last 6 hours.",
    diagnosis: "Sepsis with suspected pneumonia",
    confidence: 0.82,
    model: "Random Forest v2.4",
    medications: ["Warfarin", "Aspirin", "Piperacillin"],
    allergies: ["Penicillin"],
    medicalHistory: ["Hypertension", "Type 2 diabetes", "Prior respiratory infection admission in 2024"],
    visitHistory: ["ER visit - Feb 2026 for fever", "ICU admission - Jan 2025 for septic shock watch"],
    doctorNotes: [
      "Progressive hypoxia with persistent fever. Continue sepsis bundle and assess ICU transfer timing.",
      "Clinical note suggests pneumonia source with worsening fatigue and productive cough.",
    ],
    complaints: ["Shortness of breath", "High fever", "Fatigue", "Chest congestion"],
    aiInsight: {
      title: "Sepsis pathway remains dominant",
      explanation: "The Doctor Agent is weighting fever, hypotension, WBC elevation, and falling oxygen as the main reasons for escalation.",
      confidence: 0.82,
      agent: "Doctor Agent",
    },
    prescriptions: [
      {
        drug: "Warfarin",
        dosage: "5 mg",
        frequency: "Once daily",
        composition: "Warfarin sodium",
        interaction: "High bleed risk with Aspirin",
        allergyWarning: "No direct allergy warning",
        history: "Chronic anticoagulation for prior clot risk",
      },
      {
        drug: "Piperacillin",
        dosage: "4.5 g IV",
        frequency: "Every 8 hours",
        composition: "Piperacillin/tazobactam",
        interaction: "Requires allergy review",
        allergyWarning: "Penicillin allergy conflict detected",
        history: "Started this admission for suspected infection source",
      },
    ],
    labReports: [
      { label: "Hb", value: "11.4 g/dL", status: "Watch" },
      { label: "WBC", value: "12.8 K/uL", status: "High" },
      { label: "Platelets", value: "188 K/uL", status: "Normal" },
      { label: "Creatinine", value: "1.5 mg/dL", status: "Watch" },
      { label: "ALT", value: "44 U/L", status: "Watch" },
      { label: "COVID / Infection", value: "Bacterial source suspected", status: "High" },
    ],
    vitals: {
      heartRateBpm: 118,
      spo2Pct: 90,
      systolicMmHg: 92,
      diastolicMmHg: 58,
      temperatureC: 39.1,
      respiratoryRateRpm: 27,
      ecgSummary: "Sinus tachycardia",
    },
    trends: {
      heartRate: [102, 106, 104, 108, 110, 112, 115, 118],
      spo2: [95, 94, 94, 93, 93, 92, 91, 90],
      risk: [54, 58, 60, 66, 71, 75, 79, 82],
      respiratoryRate: [20, 21, 22, 23, 24, 25, 26, 27],
      temperature: [38.0, 38.1, 38.2, 38.4, 38.6, 38.8, 39.0, 39.1],
      ecg: [72, 80, 76, 88, 91, 95, 98, 101],
    },
    timeline: [
      "Nurse Agent flagged oxygen drop below 92%.",
      "Doctor Agent recalculated sepsis probability to 82%.",
      "Drug Agent detected penicillin allergy mismatch.",
      "Admin Agent reserved one ICU transfer bed.",
    ],
  },
  {
    id: "p002",
    mrn: "MRN-000321",
    firstName: "Sara",
    lastName: "Sharma",
    age: 33,
    gender: "Female",
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
    medicalHistory: ["Asthma", "Seasonal respiratory infections"],
    visitHistory: ["Pulmonary outpatient visit - Mar 2026", "Ward admission - Feb 2025 for viral pneumonia"],
    doctorNotes: [
      "Good antibiotic response. Continue present regimen and reassess discharge readiness tomorrow.",
      "Clinical notes show cough frequency is reducing and work of breathing is improved.",
    ],
    complaints: ["Cough", "Mild chest pain", "Weakness"],
    aiInsight: {
      title: "Pneumonia trend improving",
      explanation: "The AI insight is driven by improved oxygenation, falling WBC, and lower temperature across two checks.",
      confidence: 0.76,
      agent: "Doctor Agent",
    },
    prescriptions: [
      {
        drug: "Azithromycin",
        dosage: "500 mg",
        frequency: "Once daily",
        composition: "Azithromycin dihydrate",
        interaction: "Low interaction burden",
        allergyWarning: "No active allergy block",
        history: "Started after pneumonia confirmation",
      },
      {
        drug: "Paracetamol",
        dosage: "650 mg",
        frequency: "Every 8 hours as needed",
        composition: "Acetaminophen",
        interaction: "Monitor cumulative dose",
        allergyWarning: "No active warning",
        history: "Used for fever control during current admission",
      },
    ],
    labReports: [
      { label: "Hb", value: "12.2 g/dL", status: "Normal" },
      { label: "WBC", value: "9.4 K/uL", status: "Watch" },
      { label: "Glucose", value: "106 mg/dL", status: "Normal" },
      { label: "Creatinine", value: "0.8 mg/dL", status: "Normal" },
      { label: "AST", value: "29 U/L", status: "Normal" },
      { label: "Infection panel", value: "Improving", status: "Watch" },
    ],
    vitals: {
      heartRateBpm: 88,
      spo2Pct: 96,
      systolicMmHg: 118,
      diastolicMmHg: 76,
      temperatureC: 37.1,
      respiratoryRateRpm: 18,
      ecgSummary: "Normal sinus rhythm",
    },
    trends: {
      heartRate: [98, 96, 94, 92, 90, 90, 89, 88],
      spo2: [93, 94, 94, 95, 95, 96, 96, 96],
      risk: [58, 54, 50, 46, 42, 39, 36, 34],
      respiratoryRate: [24, 23, 22, 21, 20, 19, 18, 18],
      temperature: [38.2, 38.0, 37.8, 37.6, 37.4, 37.3, 37.2, 37.1],
      ecg: [66, 66, 65, 64, 64, 63, 63, 62],
    },
    timeline: [
      "Doctor Agent reduced escalation priority from high to medium.",
      "Nurse Agent marked respiratory trend as improving.",
      "Drug Agent confirmed current regimen is safe.",
    ],
  },
  {
    id: "p003",
    mrn: "MRN-000778",
    firstName: "Imran",
    lastName: "Khan",
    age: 49,
    gender: "Male",
    ward: "Cardiac",
    room: "218-C",
    status: "Watch",
    riskScore: 61,
    lastUpdated: "1 min ago",
    assignedAgent: "Nurse Agent",
    summary: "Arrhythmia watch remains active after repeated elevated heart-rate episodes overnight.",
    reason: "Heart rate spikes above 120 bpm, borderline pressure, and fatigue trend from nursing notes.",
    diagnosis: "Atrial fibrillation observation",
    confidence: 0.68,
    model: "XGBoost v3.1",
    medications: ["Metoprolol", "Furosemide"],
    allergies: ["Sulfa"],
    medicalHistory: ["Hypertension", "Atrial fibrillation", "Chronic edema"],
    visitHistory: ["Cardiac day-care telemetry - Jan 2026", "Admission for palpitations - Aug 2025"],
    doctorNotes: [
      "Intermittent rate spikes continue. Repeat ECG and keep telemetry active.",
      "Fatigue and rhythm irregularity remain the major monitoring concerns overnight.",
    ],
    complaints: ["Palpitations", "Fatigue", "Lightheadedness"],
    aiInsight: {
      title: "Arrhythmia watch remains active",
      explanation: "The Nurse Agent and Doctor Agent are combining high heart rate episodes, borderline pressure, and note-derived fatigue to maintain telemetry watch.",
      confidence: 0.68,
      agent: "Nurse Agent",
    },
    prescriptions: [
      {
        drug: "Metoprolol",
        dosage: "25 mg",
        frequency: "Twice daily",
        composition: "Metoprolol tartrate",
        interaction: "Can lower blood pressure with diuretics",
        allergyWarning: "No direct allergy warning",
        history: "Long-term rhythm control medication",
      },
      {
        drug: "Furosemide",
        dosage: "20 mg",
        frequency: "Once daily",
        composition: "Furosemide",
        interaction: "Monitor dehydration and pressure",
        allergyWarning: "Sulfa sensitivity watch",
        history: "Added during previous fluid-overload episode",
      },
    ],
    labReports: [
      { label: "Hb", value: "13.0 g/dL", status: "Normal" },
      { label: "WBC", value: "8.2 K/uL", status: "Normal" },
      { label: "Creatinine", value: "1.2 mg/dL", status: "Watch" },
      { label: "Urea", value: "36 mg/dL", status: "Watch" },
      { label: "Cholesterol", value: "212 mg/dL", status: "High" },
      { label: "Troponin", value: "Negative", status: "Normal" },
    ],
    vitals: {
      heartRateBpm: 124,
      spo2Pct: 93,
      systolicMmHg: 101,
      diastolicMmHg: 64,
      temperatureC: 37.8,
      respiratoryRateRpm: 22,
      ecgSummary: "Irregular tachycardic rhythm",
    },
    trends: {
      heartRate: [96, 98, 101, 108, 111, 116, 120, 124],
      spo2: [95, 95, 95, 94, 94, 94, 93, 93],
      risk: [40, 44, 48, 51, 55, 57, 59, 61],
      respiratoryRate: [18, 18, 19, 19, 20, 21, 21, 22],
      temperature: [37.1, 37.2, 37.2, 37.3, 37.4, 37.6, 37.7, 37.8],
      ecg: [54, 72, 68, 88, 81, 96, 90, 102],
    },
    timeline: [
      "Nurse Agent moved patient to continuous telemetry.",
      "Doctor Agent requested repeat ECG in 30 minutes.",
      "Admin Agent prioritized cardiac technician support.",
    ],
  },
  {
    id: "p004",
    mrn: "MRN-000812",
    firstName: "Nisha",
    lastName: "Rao",
    age: 57,
    gender: "Female",
    ward: "Oncology",
    room: "410-D",
    status: "Stable",
    riskScore: 28,
    lastUpdated: "9 min ago",
    assignedAgent: "Drug Agent",
    summary: "Medication schedule is on track and neutropenic precautions remain stable.",
    reason: "No fever, no interaction warnings, and infusion tolerance remains within expected bounds.",
    diagnosis: "Post-chemotherapy monitoring",
    confidence: 0.73,
    model: "Clinical Rules v4.0",
    medications: ["Ondansetron", "Filgrastim"],
    allergies: ["NSAIDs"],
    medicalHistory: ["Breast cancer", "Chemotherapy-related nausea"],
    visitHistory: ["Oncology infusion center - Mar 2026", "Chemo support admission - Nov 2025"],
    doctorNotes: [
      "Continue neutropenic precautions and maintain present infusion support plan.",
      "Drug Agent confirms current dosing remains safe after renal and interaction review.",
    ],
    complaints: ["Mild nausea", "Low appetite"],
    aiInsight: {
      title: "Medication schedule safe and stable",
      explanation: "The Drug Agent is generating the primary insight because timing, safety checks, and current vitals all remain within expected limits.",
      confidence: 0.73,
      agent: "Drug Agent",
    },
    prescriptions: [
      {
        drug: "Ondansetron",
        dosage: "8 mg",
        frequency: "Every 12 hours",
        composition: "Ondansetron hydrochloride",
        interaction: "Low interaction burden",
        allergyWarning: "Avoid NSAID-linked supportive meds",
        history: "Used across the present chemo cycle",
      },
      {
        drug: "Filgrastim",
        dosage: "300 mcg",
        frequency: "Once daily",
        composition: "Granulocyte colony-stimulating factor",
        interaction: "Monitor ANC response",
        allergyWarning: "No direct allergy block",
        history: "Continued to support neutrophil recovery",
      },
    ],
    labReports: [
      { label: "Hb", value: "10.6 g/dL", status: "Watch" },
      { label: "ANC", value: "1.1 K/uL", status: "Watch" },
      { label: "Platelets", value: "176 K/uL", status: "Normal" },
      { label: "Creatinine", value: "0.9 mg/dL", status: "Normal" },
      { label: "ALT", value: "31 U/L", status: "Normal" },
      { label: "COVID / Infection", value: "Negative", status: "Normal" },
    ],
    vitals: {
      heartRateBpm: 82,
      spo2Pct: 98,
      systolicMmHg: 122,
      diastolicMmHg: 80,
      temperatureC: 36.8,
      respiratoryRateRpm: 16,
      ecgSummary: "Normal rhythm",
    },
    trends: {
      heartRate: [84, 84, 83, 84, 83, 82, 82, 82],
      spo2: [98, 98, 99, 98, 98, 98, 98, 98],
      risk: [31, 31, 30, 30, 29, 29, 28, 28],
      respiratoryRate: [17, 17, 17, 16, 16, 16, 16, 16],
      temperature: [37.0, 37.0, 36.9, 36.9, 36.8, 36.8, 36.8, 36.8],
      ecg: [60, 60, 61, 60, 60, 61, 60, 60],
    },
    timeline: [
      "Drug Agent approved dose timing after renal review.",
      "Nurse Agent completed infusion checkpoint.",
      "Doctor Agent maintained routine monitoring plan.",
    ],
  },
  {
    id: "p005",
    mrn: "MRN-000956",
    firstName: "Dev",
    lastName: "Menon",
    age: 65,
    gender: "Male",
    ward: "Emergency",
    room: "ER-07",
    status: "Critical",
    riskScore: 79,
    lastUpdated: "Just now",
    assignedAgent: "Admin Agent",
    summary: "Emergency admission requires ICU coordination because capacity and staffing are constrained.",
    reason: "Rising lactate, low blood pressure, and no immediate ICU bed assignment in the primary unit.",
    diagnosis: "Shock pathway pending confirmation",
    confidence: 0.74,
    model: "Gradient Boosting v2.2",
    medications: ["Norepinephrine", "Ceftriaxone"],
    allergies: ["None"],
    medicalHistory: ["Coronary artery disease", "Chronic kidney disease stage 2"],
    visitHistory: ["Emergency admission - Mar 2026", "ICU stay - Oct 2025 for shock workup"],
    doctorNotes: [
      "Shock bundle pending confirmation. Maintain vasopressor support and expedite ICU placement.",
      "Lactate trend and blood pressure remain the strongest concerns at this time.",
    ],
    complaints: ["Dizziness", "Weakness", "Shortness of breath"],
    aiInsight: {
      title: "Shock pathway escalation remains high",
      explanation: "The Admin Agent and Doctor Agent are surfacing this insight because low pressure, rising lactate, and ICU constraints are converging.",
      confidence: 0.74,
      agent: "Admin Agent",
    },
    prescriptions: [
      {
        drug: "Norepinephrine",
        dosage: "0.08 mcg/kg/min",
        frequency: "Continuous IV infusion",
        composition: "Norepinephrine bitartrate",
        interaction: "Hemodynamic monitoring required",
        allergyWarning: "No direct allergy warning",
        history: "Started in ER for pressure support",
      },
      {
        drug: "Ceftriaxone",
        dosage: "1 g IV",
        frequency: "Every 24 hours",
        composition: "Ceftriaxone sodium",
        interaction: "Review renal clearance",
        allergyWarning: "No active allergy block",
        history: "Empiric antibiotic coverage during emergency workup",
      },
    ],
    labReports: [
      { label: "Hb", value: "12.0 g/dL", status: "Normal" },
      { label: "WBC", value: "11.7 K/uL", status: "High" },
      { label: "Lactate", value: "4.1 mmol/L", status: "Critical" },
      { label: "Creatinine", value: "1.7 mg/dL", status: "High" },
      { label: "Urea", value: "44 mg/dL", status: "High" },
      { label: "Infection panel", value: "Pending confirmation", status: "Watch" },
    ],
    vitals: {
      heartRateBpm: 122,
      spo2Pct: 91,
      systolicMmHg: 88,
      diastolicMmHg: 54,
      temperatureC: 38.4,
      respiratoryRateRpm: 28,
      ecgSummary: "Sinus tachycardia with low perfusion context",
    },
    trends: {
      heartRate: [108, 110, 112, 115, 117, 120, 121, 122],
      spo2: [95, 95, 94, 94, 93, 92, 92, 91],
      risk: [50, 54, 57, 61, 67, 71, 75, 79],
      respiratoryRate: [20, 21, 22, 23, 24, 25, 26, 28],
      temperature: [37.8, 37.9, 38.0, 38.0, 38.1, 38.2, 38.3, 38.4],
      ecg: [70, 72, 76, 80, 86, 90, 94, 97],
    },
    timeline: [
      "Admin Agent opened emergency bed allocation workflow.",
      "Doctor Agent requested vasopressor bundle.",
      "Nurse Agent escalated pressure drop on the live feed.",
    ],
  },
  {
    id: "p006",
    mrn: "MRN-001114",
    firstName: "Meera",
    lastName: "Joshi",
    age: 28,
    gender: "Female",
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
    medicalHistory: ["Recent C-section", "Post-operative recovery"],
    visitHistory: ["Post-op ward stay - current admission"],
    doctorNotes: [
      "Recovery is progressing normally. Continue routine post-operative checks and pain management.",
      "No postpartum hemorrhage signals or respiratory compromise noted in the current monitoring window.",
    ],
    complaints: ["Mild incisional pain"],
    aiInsight: {
      title: "Recovery remains low risk",
      explanation: "The Nurse Agent insight is based on stable oxygen, controlled pain, and no active postpartum alerts.",
      confidence: 0.8,
      agent: "Nurse Agent",
    },
    prescriptions: [
      {
        drug: "Ibuprofen",
        dosage: "400 mg",
        frequency: "Every 8 hours",
        composition: "Ibuprofen",
        interaction: "Monitor gastric tolerance",
        allergyWarning: "Latex allergy only, no direct drug block",
        history: "Used for post-operative pain control",
      },
      {
        drug: "Oxytocin",
        dosage: "10 units",
        frequency: "Per protocol",
        composition: "Oxytocin",
        interaction: "Postpartum monitoring required",
        allergyWarning: "No direct warning",
        history: "Administered post-procedure",
      },
    ],
    labReports: [
      { label: "Hb", value: "11.9 g/dL", status: "Normal" },
      { label: "WBC", value: "8.8 K/uL", status: "Normal" },
      { label: "Platelets", value: "205 K/uL", status: "Normal" },
      { label: "Creatinine", value: "0.7 mg/dL", status: "Normal" },
      { label: "Glucose", value: "99 mg/dL", status: "Normal" },
      { label: "Infection panel", value: "No active signs", status: "Normal" },
    ],
    vitals: {
      heartRateBpm: 76,
      spo2Pct: 99,
      systolicMmHg: 114,
      diastolicMmHg: 72,
      temperatureC: 36.7,
      respiratoryRateRpm: 15,
      ecgSummary: "Normal rhythm",
    },
    trends: {
      heartRate: [82, 81, 80, 79, 78, 78, 77, 76],
      spo2: [98, 98, 98, 99, 99, 99, 99, 99],
      risk: [24, 24, 22, 21, 20, 20, 19, 18],
      respiratoryRate: [17, 17, 16, 16, 16, 16, 15, 15],
      temperature: [36.9, 36.9, 36.8, 36.8, 36.8, 36.7, 36.7, 36.7],
      ecg: [61, 61, 60, 60, 60, 59, 59, 59],
    },
    timeline: [
      "Nurse Agent closed one low-priority mobility reminder.",
      "Drug Agent confirmed no lactation-related interaction risks.",
    ],
  },
]

export const metricCards: MetricCard[] = [
  {
    id: "critical",
    label: "Critical Patients",
    value: "12",
    delta: "+3 today",
    tone: "critical",
    note: "Doctor and Nurse agents agree on 4 urgent escalations.",
  },
  {
    id: "heart",
    label: "Avg Heart Rate",
    value: "98 bpm",
    delta: "Slightly high",
    tone: "warning",
    note: "Cardiac ward drift increased after midnight.",
  },
  {
    id: "alerts",
    label: "Active Alerts",
    value: "27",
    delta: "Live feed",
    tone: "critical",
    note: "7 alerts are pending acknowledgement.",
  },
  {
    id: "drug",
    label: "Drug Conflicts",
    value: "5",
    delta: "High severity",
    tone: "warning",
    note: "Three anticoagulant conflicts need review.",
  },
  {
    id: "icu",
    label: "ICU Availability",
    value: "3 beds",
    delta: "Critical",
    tone: "info",
    note: "Admin Agent recommends protected bed reserve.",
  },
  {
    id: "response",
    label: "Response Time",
    value: "-32%",
    delta: "Improved",
    tone: "good",
    note: "Average triage-to-action time improved this week.",
  },
]

export const criticalAlerts: IntelligenceAlert[] = [
  {
    id: "a1",
    title: "Sepsis Risk: 82%",
    description: "Aarav Patil shows fever, low blood pressure, and SpO2 decline across the last 6 hours.",
    severity: "Critical",
    agent: "Doctor Agent",
    tag: "Requires ICU review",
    time: "Now",
  },
  {
    id: "a2",
    title: "Oxygen Dropped Below 90%",
    description: "Dev Menon triggered a sustained oxygen dip with simultaneous heart-rate acceleration.",
    severity: "Critical",
    agent: "Nurse Agent",
    tag: "Bedside escalation",
    time: "1 min ago",
  },
  {
    id: "a3",
    title: "Drug Conflict: Aspirin + Warfarin",
    description: "High bleed-risk combination detected against the current anticoagulation pathway.",
    severity: "High",
    agent: "Drug Agent",
    tag: "Medication block",
    time: "4 min ago",
  },
  {
    id: "a4",
    title: "ICU Capacity Threshold Reached",
    description: "Only three protected ICU beds remain after emergency admission routing.",
    severity: "High",
    agent: "Admin Agent",
    tag: "Operations watch",
    time: "8 min ago",
  },
]

export const insightCards: InsightCard[] = [
  {
    id: "i1",
    type: "Critical",
    title: "Sepsis Probability 82%",
    summary: "Immediate ICU attention recommended.",
    explanation: "High WBC, fever, low systolic pressure, and oxygen decline are driving the score.",
    confidence: 0.82,
    agent: "Doctor Agent",
    accent: "red",
  },
  {
    id: "i2",
    type: "Diagnosis",
    title: "Predicted Pneumonia 76%",
    summary: "Condition is improving under current antibiotics.",
    explanation: "Cough, elevated temperature, and prior WBC pattern remain the strongest features.",
    confidence: 0.76,
    agent: "Doctor Agent",
    accent: "cyan",
  },
  {
    id: "i3",
    type: "State",
    title: "Vitals Trend: Improving",
    summary: "Respiratory distress markers are tapering down.",
    explanation: "SpO2 rose from 93% to 96% while temperature normalized over two checks.",
    confidence: 0.71,
    agent: "Nurse Agent",
    accent: "emerald",
  },
  {
    id: "i4",
    type: "Drug",
    title: "Bleed Risk Conflict",
    summary: "Aspirin plus Warfarin should be reviewed before next dose.",
    explanation: "Anticoagulant overlap and current platelet trend elevate adverse bleeding risk.",
    confidence: 0.88,
    agent: "Drug Agent",
    accent: "amber",
  },
  {
    id: "i5",
    type: "Admin",
    title: "Staff Load High In ER",
    summary: "Night shift occupancy crossed the target threshold.",
    explanation: "Emergency arrivals rose 18% while available nurse coverage dropped by one shift slot.",
    confidence: 0.8,
    agent: "Admin Agent",
    accent: "violet",
  },
  {
    id: "i6",
    type: "State",
    title: "ICU Risk Score 79%",
    summary: "Transfer should be coordinated before vasopressor demand rises further.",
    explanation: "Shock indicators, current bed pressure, and nurse attention demand are all elevated.",
    confidence: 0.79,
    agent: "Admin Agent",
    accent: "red",
  },
]

export const chatSeed: ChatMessage[] = [
  { id: "c1", role: "user", body: "Why is patient critical?" },
  {
    id: "c2",
    role: "assistant",
    agent: "Doctor Agent",
    route: "Diagnosis route",
    body: "Aarav is critical because oxygen dropped to 90%, temperature rose to 39.1C, systolic pressure fell to 92 mmHg, and the sepsis model now estimates 82% risk.",
  },
  {
    id: "c3",
    role: "assistant",
    agent: "Nurse Agent",
    route: "Monitoring route",
    body: "Bedside trend confirms the decline started about six hours ago, with steady SpO2 drop and persistent tachycardia.",
  },
]

export const predictionSeries = {
  risk: [48, 51, 56, 59, 63, 67, 71, 76, 79, 82],
  hospitalLoad: [68, 66, 70, 74, 72, 77, 81, 80, 83, 85],
  drugInteractions: [1, 2, 1, 3, 2, 4, 5, 3, 4, 5],
  icuDemand: [2, 2, 3, 3, 4, 5, 4, 5, 6, 6],
}

export const predictionBuckets = [
  { label: "Readmission", value: "23%", note: "Likely within 7 days for cardiac watchlist." },
  { label: "ICU Transfer", value: "41%", note: "Driven by shock pathway and sepsis cohort." },
  { label: "Escalation Overrun", value: "18%", note: "Night shift staffing pressure is the main driver." },
]

export const nurseQueue = [
  { label: "Telemetry review", patient: "Imran Khan", status: "Due now", note: "HR stayed above 120 bpm for 9 min." },
  { label: "Pressure recheck", patient: "Dev Menon", status: "Urgent", note: "Systolic trend is still under 90." },
  { label: "Mobility reminder", patient: "Meera Joshi", status: "In progress", note: "Low-priority post-op protocol step." },
]

export const doctorDecisions = [
  { patient: "Aarav Patil", diagnosis: "Sepsis with suspected pneumonia", confidence: "82%", why: "WBC, fever, hypotension, SpO2 decline", action: "Escalate ICU and repeat cultures" },
  { patient: "Sara Sharma", diagnosis: "Pneumonia improving", confidence: "76%", why: "WBC down, temp down, respiratory status better", action: "Continue present regimen" },
  { patient: "Dev Menon", diagnosis: "Shock pathway pending", confidence: "74%", why: "Low pressure, rising lactate, oxygen drop", action: "Bed coordination and vasopressor bundle" },
]

export const drugMatrix = [
  { pair: "Warfarin + Aspirin", severity: "High", patient: "Aarav Patil", why: "Dual anticoagulation bleed risk", action: "Hold aspirin until doctor review" },
  { pair: "Piperacillin + Penicillin Allergy", severity: "Critical", patient: "Aarav Patil", why: "Allergy conflict detected", action: "Swap antibiotic class" },
  { pair: "Metoprolol + Furosemide", severity: "Medium", patient: "Imran Khan", why: "Monitor pressure and dizziness", action: "Keep telemetry active" },
]

export const adminSignals = [
  { label: "ER Occupancy", value: "91%", detail: "Emergency arrivals are outpacing discharges.", action: "Open overflow staffing." },
  { label: "ICU Staffing", value: "86%", detail: "One nurse short for ideal night ratio.", action: "Reassign float pool." },
  { label: "Avg Triage Time", value: "7 min", detail: "Still within target after automation improvements.", action: "Maintain current workflow." },
]

export const logs: LogItem[] = [
  { id: "l1", level: "Critical", service: "event-bus", summary: "Emergency escalation broadcast", detail: "Shock pathway event was published to doctor, nurse, and admin queues.", at: "2026-03-26 08:42" },
  { id: "l2", level: "Warning", service: "drug-agent", summary: "Medication conflict detected", detail: "Warfarin plus aspirin collision raised a high-severity safety gate.", at: "2026-03-26 08:38" },
  { id: "l3", level: "Info", service: "doctor-agent", summary: "Prediction refreshed", detail: "Sepsis model score recalculated after lab ingestion.", at: "2026-03-26 08:36" },
  { id: "l4", level: "Info", service: "admin-agent", summary: "Bed reservation updated", detail: "Protected ICU capacity changed from four to three beds.", at: "2026-03-26 08:30" },
]

export const modelRegistry: ModelRegistryItem[] = [
  { id: "m1", name: "Sepsis RF", purpose: "Deterioration and sepsis risk scoring", version: "2.4.1", status: "Healthy", accuracy: "92.4%", drift: "Low", owner: "Doctor Agent" },
  { id: "m2", name: "Vitals Anomaly Watcher", purpose: "Continuous bedside abnormality detection", version: "1.8.0", status: "Monitoring", accuracy: "89.1%", drift: "Medium", owner: "Nurse Agent" },
  { id: "m3", name: "Medication Safety Rules", purpose: "Interaction, allergy, and renal dosing checks", version: "4.0.3", status: "Healthy", accuracy: "Rule based", drift: "None", owner: "Drug Agent" },
  { id: "m4", name: "Flow Forecast", purpose: "Bed load, staffing pressure, and transfer demand", version: "3.2.5", status: "Needs Review", accuracy: "84.7%", drift: "High", owner: "Admin Agent" },
]

export const promptSuggestions = [
  "Why is patient critical?",
  "Show lab abnormalities",
  "Which patients need ICU attention?",
  "Explain the drug conflict",
  "What is hospital load status?",
  "Summarize Aarav Patil for morning rounds",
  "Show vitals trend for the selected patient",
  "What did the clinical notes add?",
  "Give me the next best action",
  "Which agent should I trust most right now?",
]

export const settingsGroups = [
  {
    title: "Alert Routing",
    items: [
      "Auto-route critical deterioration to Doctor and Nurse agents",
      "Escalate unresolved alerts after 3 minutes",
      "Mirror drug conflicts to pharmacy supervisor",
    ],
  },
  {
    title: "Explainability",
    items: [
      "Show top three contributing factors on every AI card",
      "Display model version with confidence score",
      "Expose evidence chain in chat answers",
    ],
  },
  {
    title: "Display Preferences",
    items: [
      "Keep dark mode enabled by default",
      "Pin floating chat access on every page",
      "Reduce motion for bedside tablets",
    ],
  },
]

export const labAbnormalities = [
  {
    patient: "Aarav Patil",
    marker: "WBC",
    value: "12.8 K/uL",
    status: "High",
    why: "Supports infection burden and sepsis pathway activation.",
  },
  {
    patient: "Dev Menon",
    marker: "Lactate",
    value: "4.1 mmol/L",
    status: "Critical",
    why: "Perfusion risk is rising and shock workflow should stay active.",
  },
  {
    patient: "Imran Khan",
    marker: "BNP",
    value: "689 pg/mL",
    status: "Watch",
    why: "May increase fluid-management sensitivity in the cardiac unit.",
  },
  {
    patient: "Nisha Rao",
    marker: "ANC",
    value: "1.1 K/uL",
    status: "Watch",
    why: "Neutropenic precautions remain important despite stable vitals.",
  },
]

export const doctorDifferentials = [
  {
    patient: "Aarav Patil",
    lead: "Sepsis with suspected pneumonia",
    alternatives: ["Acute respiratory infection", "Pulmonary edema", "Mixed shock syndrome"],
    confidence: "82%",
    recommendation: "Repeat cultures, early ICU coordination, and allergy-safe antibiotic adjustment.",
  },
  {
    patient: "Imran Khan",
    lead: "Atrial fibrillation observation",
    alternatives: ["Demand ischemia", "Electrolyte-triggered arrhythmia", "Fluid overload episode"],
    confidence: "68%",
    recommendation: "Repeat ECG, continue telemetry, and review potassium trend before escalation.",
  },
]

export const nurseDevices = [
  {
    device: "Bedside telemetry",
    patient: "Imran Khan",
    health: "Healthy",
    note: "Streaming without packet loss for the last 2 hours.",
  },
  {
    device: "Pulse oximeter",
    patient: "Aarav Patil",
    health: "Attention",
    note: "Intermittent signal drop during movement; manual verification recommended.",
  },
  {
    device: "Infusion pump",
    patient: "Nisha Rao",
    health: "Healthy",
    note: "Dose timing synchronized with Drug Agent plan.",
  },
]

export const dosageRecommendations = [
  {
    drug: "Warfarin",
    patient: "Aarav Patil",
    action: "Hold next overlapping aspirin dose",
    why: "Bleed risk remains high under current platelet and anticoagulation context.",
  },
  {
    drug: "Piperacillin",
    patient: "Aarav Patil",
    action: "Switch antibiotic class",
    why: "Allergy conflict was detected by the Drug Agent safety engine.",
  },
  {
    drug: "Metoprolol",
    patient: "Imran Khan",
    action: "Continue with pressure watch",
    why: "Heart-rate stabilization benefit outweighs current mild hypotension risk.",
  },
]

export const adminWorkflowBoard = [
  {
    lane: "Admissions",
    value: "14 pending",
    note: "ER inflow is ahead of discharge throughput this shift.",
  },
  {
    lane: "Transfers",
    value: "5 active",
    note: "Two ICU coordination requests are blocked on staffing confirmation.",
  },
  {
    lane: "Discharges",
    value: "9 ready",
    note: "Three cases are waiting on final doctor sign-off and medication reconciliation.",
  },
]

export const predictionSignals = [
  { label: "Sepsis risk", value: 82, note: "Highest active deterioration pathway" },
  { label: "Readmission", value: 23, note: "Cardiac watchlist remains the biggest contributor" },
  { label: "ICU demand", value: 41, note: "Driven by emergency and sepsis cohort" },
  { label: "Resource strain", value: 18, note: "Night shift coverage still creates the largest drag" },
]

export const chatRoutingMatrix = [
  { route: "Diagnosis questions", volume: 42, agent: "Doctor Agent" },
  { route: "Vitals and monitoring", volume: 36, agent: "Nurse Agent" },
  { route: "Medication safety", volume: 24, agent: "Drug Agent" },
  { route: "Workflow and load", volume: 18, agent: "Admin Agent" },
]

export const wardLoadMatrix = [
  { ward: "Emergency", load: 91, capacity: 84 },
  { ward: "ICU South", load: 88, capacity: 76 },
  { ward: "Pulmonary", load: 63, capacity: 58 },
  { ward: "Cardiac", load: 71, capacity: 65 },
  { ward: "Oncology", load: 54, capacity: 49 },
]

export const auditSummary = [
  { label: "Doctor decisions reviewed", value: "18", note: "4 were escalated for second opinion" },
  { label: "Nurse alerts acknowledged", value: "27", note: "Median acknowledgment now under 2 min" },
  { label: "Drug blocks issued", value: "5", note: "Two caused regimen changes before administration" },
  { label: "Admin reallocations", value: "7", note: "ICU and ER flow saw the biggest benefit" },
]

export const modelFeedbackSignals = [
  {
    step: "Clinical confirmation",
    detail: "Doctors and nurses verify whether the surfaced decision was appropriate in context.",
  },
  {
    step: "Outcome capture",
    detail: "Final patient outcomes are linked to alerts, recommendations, and interventions.",
  },
  {
    step: "Drift monitoring",
    detail: "Feature movement and declining precision trigger monitoring or retraining review.",
  },
  {
    step: "Model promotion",
    detail: "Only validated versions move into the active decision mesh used by clinical teams.",
  },
]

export const algorithmRegistry = [
  {
    name: "Support Vector Machine",
    shorthand: "SVM",
    role: "Doctor Agent",
    purpose: "High-dimensional disease classification",
    note: "Used where sparse, high-signal clinical features need clean separation boundaries.",
  },
  {
    name: "Random Forest",
    shorthand: "RF",
    role: "Doctor Agent",
    purpose: "Explainable disease risk and feature importance",
    note: "Provides robust performance on noisy medical data with readable importance signals.",
  },
  {
    name: "Logistic Regression",
    shorthand: "LR",
    role: "Doctor Agent",
    purpose: "Fast binary prediction and probability scoring",
    note: "Supports quick risk classification with interpretable probability output.",
  },
  {
    name: "Q-Learning",
    shorthand: "RL",
    role: "Doctor Agent",
    purpose: "Adaptive treatment recommendation",
    note: "Learns treatment policies from outcomes to support personalized care pathways.",
  },
  {
    name: "BERT",
    shorthand: "NLP",
    role: "Doctor Agent",
    purpose: "Clinical note and free-text understanding",
    note: "Extracts meaningful findings from unstructured notes and patient communication.",
  },
]

export const interoperabilityFlows = [
  {
    flow: "FHIR patient sync",
    standard: "FHIR R4",
    status: "Live",
    note: "Unified patient summaries are assembled across structured hospital systems.",
  },
  {
    flow: "HL7 lab ingestion",
    standard: "HL7",
    status: "Streaming",
    note: "Incoming lab results are normalized into continuously updated patient profiles.",
  },
  {
    flow: "Pharmacy reconciliation",
    standard: "FHIR MedicationRequest",
    status: "Active",
    note: "Drug Agent reads medication orders and safety flags from a shared record model.",
  },
  {
    flow: "IoT device bridge",
    standard: "Event broker",
    status: "Live",
    note: "Vitals from medical devices are routed to Nurse and Doctor agents in real time.",
  },
]

export const securityControls = [
  {
    control: "Biometric authentication",
    status: "Enabled",
    note: "Doctors, nurses, and admins authenticate with role-aware secure access controls.",
  },
  {
    control: "Blockchain audit trail",
    status: "Immutable",
    note: "Medication and clinical actions are recorded for traceability and tamper resistance.",
  },
  {
    control: "Consent-aware data access",
    status: "Scoped",
    note: "Patient data access is limited by role, workflow need, and secure policy boundaries.",
  },
  {
    control: "Cross-hospital interoperability",
    status: "Standards-based",
    note: "FHIR and HL7 mapping preserve secure data exchange across connected systems.",
  },
]

export const blockchainEvents = [
  {
    event: "Prescription signed",
    actor: "Doctor Agent",
    detail: "Medication plan was written and versioned before pharmacy release.",
  },
  {
    event: "Drug safety hold",
    actor: "Drug Agent",
    detail: "Conflict block was written to the trace ledger before administration could continue.",
  },
  {
    event: "Critical alert escalation",
    actor: "Nurse Agent",
    detail: "Emergency escalation was recorded with timestamp, patient context, and response owner.",
  },
  {
    event: "ICU bed reassignment",
    actor: "Admin Agent",
    detail: "Protected resource change was captured for audit and operational review.",
  },
]

export const clinicalNoteSignals = [
  {
    label: "Symptom extraction",
    value: 81,
    note: "BERT identified worsening cough, fatigue, and respiratory distress from free-text notes.",
  },
  {
    label: "Context confidence",
    value: 76,
    note: "Clinical note understanding aligns well with structured vitals and labs.",
  },
  {
    label: "Ambiguity risk",
    value: 34,
    note: "Some note fragments still need clinician confirmation before escalation.",
  },
  {
    label: "Recommendation lift",
    value: 68,
    note: "NLP findings materially improve diagnosis confidence for complex cases.",
  },
]

export const testingSignals = [
  {
    label: "Unit test scope",
    value: "Core modules",
    note: "Validation focuses on agents, alerts, patient state, and system integration points.",
  },
  {
    label: "Integration flow",
    value: "Cross-agent",
    note: "Testing verifies Doctor, Nurse, Drug, and Admin decisions remain consistent under streaming updates.",
  },
  {
    label: "User acceptance",
    value: "Clinical review",
    note: "Healthcare professionals validate clarity, reliability, and actionability of surfaced insights.",
  },
  {
    label: "Maintenance loop",
    value: "Continuous",
    note: "Monitoring, feedback, and retraining keep the system accurate over time.",
  },
]
