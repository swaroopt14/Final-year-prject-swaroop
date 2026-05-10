import { connectToDatabase, disconnectFromDatabase } from "../config/db.config.js";
import { PatientModel } from "../modules/ehr/ehr.model.js";
import { LabReportModel } from "../modules/lab/lab.model.js";
import { VitalRecordModel } from "../modules/vitals/vitals.model.js";

async function seed() {
  await connectToDatabase();

  await Promise.all([PatientModel.deleteMany({}), VitalRecordModel.deleteMany({}), LabReportModel.deleteMany({})]);

  const patients = await PatientModel.insertMany([
    {
      mrn: "MRN-1001",
      firstName: "Aarav",
      lastName: "Patel",
      dateOfBirth: new Date("1953-04-12"),
      sex: "male",
      allergies: ["penicillin"],
      comorbidities: ["hypertension", "depression", "type2_diabetes"]
    },
    {
      mrn: "MRN-1002",
      firstName: "Diya",
      lastName: "Sharma",
      dateOfBirth: new Date("1975-09-03"),
      sex: "female",
      allergies: [],
      comorbidities: ["type2_diabetes"]
    },
    {
      mrn: "MRN-1003",
      firstName: "Noah",
      lastName: "Williams",
      dateOfBirth: new Date("1990-01-21"),
      sex: "male",
      allergies: ["ibuprofen"],
      comorbidities: []
    },
    {
      mrn: "MRN-1004",
      firstName: "Sophia",
      lastName: "Kim",
      dateOfBirth: new Date("1982-12-08"),
      sex: "female",
      allergies: [],
      comorbidities: ["asthma"]
    },
    {
      mrn: "MRN-1005",
      firstName: "Liam",
      lastName: "Garcia",
      dateOfBirth: new Date("1959-06-30"),
      sex: "male",
      allergies: ["sulfa"],
      comorbidities: ["ckd_stage3"]
    }
  ]);

  const now = Date.now();
  const vitals = [];

  // Generic vitals for patients 1..N
  for (let i = 0; i < 10; i++) {
    const patient = patients[i % patients.length]!;
    vitals.push({
      patientId: patient._id,
      recordedAt: new Date(now - i * 60_000),
      heartRateBpm: 72 + (i % 5) * 3,
      systolicMmHg: 118 + (i % 4) * 4,
      diastolicMmHg: 76 + (i % 3) * 2,
      spo2Pct: 96 - (i % 3),
      temperatureC: 36.7 + (i % 4) * 0.1
    });
  }

  // Acute-stroke progression for Aarav (5 readings over the last 25 min,
  // newest first). Used by the stroke case-study walkthrough on Day 11.
  const stroke = [
    { mins: 25, hr: 92, sys: 148, dia: 94, spo2: 96, temp: 37.1 },
    { mins: 20, hr: 98, sys: 162, dia: 98, spo2: 95, temp: 37.2 },
    { mins: 15, hr: 104, sys: 174, dia: 102, spo2: 93, temp: 37.3 },
    { mins: 10, hr: 110, sys: 184, dia: 106, spo2: 90, temp: 37.4 },
    { mins: 3, hr: 116, sys: 188, dia: 110, spo2: 88, temp: 37.6 }
  ];
  for (const v of stroke) {
    vitals.push({
      patientId: patients[0]!._id,
      recordedAt: new Date(now - v.mins * 60_000),
      heartRateBpm: v.hr,
      systolicMmHg: v.sys,
      diastolicMmHg: v.dia,
      spo2Pct: v.spo2,
      temperatureC: v.temp
    });
  }

  await VitalRecordModel.insertMany(vitals);

  await LabReportModel.insertMany([
    {
      patientId: patients[0]!._id,
      reportType: "CBC",
      reportedAt: new Date(now - 86_400_000),
      summary: "Mild anemia suspected; follow-up advised.",
      values: { hemoglobin: 11.4, wbc: 7.2, platelets: 210 }
    },
    {
      patientId: patients[1]!._id,
      reportType: "HbA1c",
      reportedAt: new Date(now - 7 * 86_400_000),
      summary: "Elevated HbA1c; tighten glycemic control.",
      values: { hba1c: 8.1 }
    },
    {
      patientId: patients[2]!._id,
      reportType: "Lipid Panel",
      reportedAt: new Date(now - 14 * 86_400_000),
      summary: "Borderline LDL; lifestyle interventions recommended.",
      values: { ldl: 132, hdl: 44, triglycerides: 160 }
    },
    {
      patientId: patients[3]!._id,
      reportType: "CRP",
      reportedAt: new Date(now - 3 * 86_400_000),
      summary: "CRP within normal limits.",
      values: { crp: 2.1 }
    },
    {
      patientId: patients[4]!._id,
      reportType: "BMP",
      reportedAt: new Date(now - 2 * 86_400_000),
      summary: "Renal markers consistent with baseline CKD.",
      values: { creatinine: 1.7, bun: 28, sodium: 139, potassium: 4.7 }
    }
  ]);
}

seed()
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log("Seed complete");
    await disconnectFromDatabase();
    process.exit(0);
  })
  .catch(async (err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    await disconnectFromDatabase();
    process.exit(1);
  });

