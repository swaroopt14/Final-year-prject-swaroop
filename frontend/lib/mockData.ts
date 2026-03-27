"use client";

export type MockPatient = {
  _id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: "M" | "F";
  comorbidities?: string[];
};

export type MockVital = {
  recordedAt: string;
  heartRateBpm: number;
  systolicMmHg: number;
  diastolicMmHg: number;
  spo2Pct: number;
  temperatureC: number;
};

export type MockLabReport = {
  reportedAt: string;
  reportType: string;
  summary: string;
  values: Record<string, number>;
};

export type MockAlertItem = { type: string; at: number; payload: unknown };

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

export const mockPatients: MockPatient[] = [
  {
    _id: "p_001",
    mrn: "MRN-000145",
    firstName: "Aarav",
    lastName: "Patil",
    dateOfBirth: "1984-11-08",
    sex: "M",
    comorbidities: ["HTN", "Type 2 DM"]
  },
  {
    _id: "p_002",
    mrn: "MRN-000321",
    firstName: "Sara",
    lastName: "Sharma",
    dateOfBirth: "1992-03-17",
    sex: "F",
    comorbidities: ["Asthma"]
  },
  {
    _id: "p_003",
    mrn: "MRN-000778",
    firstName: "Imran",
    lastName: "Khan",
    dateOfBirth: "1976-06-02",
    sex: "M",
    comorbidities: ["CKD", "CHF"]
  }
];

export const mockVitalsByPatient: Record<string, MockVital[]> = {
  p_001: [
    { recordedAt: daysAgo(0), heartRateBpm: 112, systolicMmHg: 98, diastolicMmHg: 62, spo2Pct: 91, temperatureC: 38.7 },
    { recordedAt: daysAgo(0.5), heartRateBpm: 105, systolicMmHg: 104, diastolicMmHg: 66, spo2Pct: 93, temperatureC: 38.3 },
    { recordedAt: daysAgo(1), heartRateBpm: 96, systolicMmHg: 112, diastolicMmHg: 70, spo2Pct: 95, temperatureC: 37.9 },
    { recordedAt: daysAgo(2), heartRateBpm: 88, systolicMmHg: 118, diastolicMmHg: 72, spo2Pct: 96, temperatureC: 37.2 }
  ],
  p_002: [
    { recordedAt: daysAgo(0), heartRateBpm: 86, systolicMmHg: 120, diastolicMmHg: 78, spo2Pct: 97, temperatureC: 36.9 },
    { recordedAt: daysAgo(1), heartRateBpm: 90, systolicMmHg: 122, diastolicMmHg: 80, spo2Pct: 96, temperatureC: 37.1 },
    { recordedAt: daysAgo(2), heartRateBpm: 84, systolicMmHg: 118, diastolicMmHg: 76, spo2Pct: 97, temperatureC: 36.8 }
  ],
  p_003: [
    { recordedAt: daysAgo(0), heartRateBpm: 124, systolicMmHg: 92, diastolicMmHg: 58, spo2Pct: 89, temperatureC: 39.2 },
    { recordedAt: daysAgo(0.5), heartRateBpm: 118, systolicMmHg: 96, diastolicMmHg: 60, spo2Pct: 90, temperatureC: 39.0 },
    { recordedAt: daysAgo(1), heartRateBpm: 108, systolicMmHg: 102, diastolicMmHg: 64, spo2Pct: 92, temperatureC: 38.6 }
  ]
};

export const mockLabsByPatient: Record<string, MockLabReport[]> = {
  p_001: [
    {
      reportedAt: daysAgo(1),
      reportType: "CBC",
      summary: "Mild leukocytosis; monitor infection markers.",
      values: { WBC: 12.8, Hb: 13.4, Platelets: 210 }
    }
  ],
  p_002: [
    {
      reportedAt: daysAgo(2),
      reportType: "CRP",
      summary: "CRP within normal range.",
      values: { CRP: 3.1 }
    }
  ],
  p_003: [
    {
      reportedAt: daysAgo(0.8),
      reportType: "CMP",
      summary: "Creatinine elevated; consider renal dosing adjustments.",
      values: { Creatinine: 2.2, Sodium: 134, Potassium: 5.1 }
    }
  ]
};

export function getMockAlerts(): MockAlertItem[] {
  const now = Date.now();
  return [
    {
      type: "vitals.stream",
      at: now - 12_000,
      payload: { patientId: "p_001", spo2Pct: 91, heartRateBpm: 112, temperatureC: 38.7 }
    },
    {
      type: "high_risk_alert",
      at: now - 45_000,
      payload: { patientId: "p_003", reason: "Abnormal vitals detected", riskScore: 0.86 }
    },
    {
      type: "drug_alert",
      at: now - 95_000,
      payload: { patientId: "p_001", flagged: true, interactions: [{ a: "warfarin", b: "aspirin", severity: "high" }] }
    }
  ];
}

