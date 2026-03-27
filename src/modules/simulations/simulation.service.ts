import { v4 as uuidv4 } from "uuid";
import { eventBus } from "../../events/index.js";
import { Topics } from "../../events/topics.js";
import { runClinicalDecisionCycle } from "../agents/clinical.decision.js";
import { ehrService } from "../ehr/ehr.service.js";
import { labService } from "../lab/lab.service.js";
import { pharmacyService } from "../pharmacy/pharmacy.service.js";
import { vitalsService } from "../vitals/vitals.service.js";
import type { StartSimulationInput } from "./simulation.validation.js";

type SimulationStatus = "starting" | "running" | "completed" | "failed";

type SyntheticPatient = {
  patientId: string;
  mrn: string;
  fullName: string;
  highRisk: boolean;
};

type SimulationStats = {
  ticksProcessed: number;
  vitalsRecords: number;
  labReports: number;
  pharmacyOrders: number;
  clinicalNotes: number;
  decisions: number;
  highRiskDecisions: number;
  attendingEscalations: number;
};

type SimulationRun = {
  id: string;
  status: SimulationStatus;
  config: StartSimulationInput;
  startedAt: string;
  endedAt: string | null;
  patientIds: string[];
  stats: SimulationStats;
  error: string | null;
};

type SeverityBand = "high" | "moderate" | "low";

type Vitals = {
  heartRateBpm: number;
  systolicMmHg: number;
  diastolicMmHg: number;
  spo2Pct: number;
  temperatureC: number;
};

const runs = new Map<string, SimulationRun>();

function buildRng(seed?: number) {
  if (seed === undefined) return Math.random;
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pickSeverity(highRisk: boolean, rng: () => number): SeverityBand {
  if (highRisk) return rng() < 0.75 ? "high" : "moderate";
  return rng() < 0.2 ? "moderate" : "low";
}

function makeVitals(severity: SeverityBand, rng: () => number): Vitals {
  if (severity === "high") {
    return {
      heartRateBpm: 125 + Math.floor(rng() * 25),
      systolicMmHg: 170 + Math.floor(rng() * 25),
      diastolicMmHg: 105 + Math.floor(rng() * 18),
      spo2Pct: 84 + Math.floor(rng() * 8),
      temperatureC: 38.6 + Number((rng() * 1.6).toFixed(1))
    };
  }

  if (severity === "moderate") {
    return {
      heartRateBpm: 98 + Math.floor(rng() * 18),
      systolicMmHg: 136 + Math.floor(rng() * 20),
      diastolicMmHg: 88 + Math.floor(rng() * 14),
      spo2Pct: 91 + Math.floor(rng() * 6),
      temperatureC: 37.4 + Number((rng() * 1.1).toFixed(1))
    };
  }

  return {
    heartRateBpm: 68 + Math.floor(rng() * 18),
    systolicMmHg: 110 + Math.floor(rng() * 16),
    diastolicMmHg: 68 + Math.floor(rng() * 12),
    spo2Pct: 96 + Math.floor(rng() * 4),
    temperatureC: 36.6 + Number((rng() * 0.7).toFixed(1))
  };
}

function makeLabs(severity: SeverityBand, rng: () => number) {
  if (severity === "high") {
    return {
      wbc: 14 + Number((rng() * 6).toFixed(1)),
      lactate: 2.7 + Number((rng() * 2.4).toFixed(1)),
      creatinine: 1.5 + Number((rng() * 1.1).toFixed(1)),
      troponin: 0.4 + Number((rng() * 1.2).toFixed(2))
    };
  }

  if (severity === "moderate") {
    return {
      wbc: 10 + Number((rng() * 3.5).toFixed(1)),
      lactate: 1.8 + Number((rng() * 1.4).toFixed(1)),
      creatinine: 1 + Number((rng() * 0.8).toFixed(1)),
      troponin: 0.05 + Number((rng() * 0.15).toFixed(2))
    };
  }

  return {
    wbc: 5.2 + Number((rng() * 2.8).toFixed(1)),
    lactate: 0.7 + Number((rng() * 0.9).toFixed(1)),
    creatinine: 0.7 + Number((rng() * 0.5).toFixed(1)),
    troponin: Number((rng() * 0.03).toFixed(2))
  };
}

function makeDrugs(severity: SeverityBand, rng: () => number) {
  if (severity === "high") {
    return rng() < 0.55 ? ["warfarin", "aspirin"] : ["metformin", "contrast_dye"];
  }
  if (severity === "moderate") {
    return rng() < 0.4 ? ["lisinopril", "spironolactone"] : ["amoxicillin", "paracetamol"];
  }
  return ["paracetamol"];
}

function makeClinicalNote(patient: SyntheticPatient, severity: SeverityBand, tick: number) {
  if (severity === "high") {
    return `${patient.fullName} has progressive respiratory distress on tick ${tick}. Persistent tachycardia, low SpO2, and elevated lactate suggest possible sepsis or cardiopulmonary deterioration.`;
  }
  if (severity === "moderate") {
    return `${patient.fullName} shows intermittent instability on tick ${tick}. Mild desaturation and blood pressure elevation require closer reassessment and targeted labs.`;
  }
  return `${patient.fullName} remains hemodynamically stable on tick ${tick}. Continue routine monitoring and ward-level observation.`;
}

function buildHl7Message(params: {
  mrn: string;
  fullName: string;
  observedAt: string;
  values: Record<string, number>;
}) {
  const [lastName, firstName] = params.fullName.split(" ");
  const obxRows = Object.entries(params.values)
    .map(([name, value], idx) => `OBX|${idx + 1}|NM|${name}^${name.toUpperCase()}||${value}|sim_units`)
    .join("\r");

  return [
    `MSH|^~\\&|SIM|SMART_HOSP|EHR|SMART_HOSP|${params.observedAt}||ORU^R01|${uuidv4()}|P|2.3`,
    `PID|1||${params.mrn}||${lastName ?? "Patient"}^${firstName ?? "Sim"}`,
    obxRows,
    "NTE|1||Synthetic simulation lab report"
  ].join("\r");
}

function calcDobYear(highRisk: boolean, rng: () => number) {
  if (highRisk) return 1948 + Math.floor(rng() * 27);
  return 1978 + Math.floor(rng() * 30);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function snapshot(run: SimulationRun) {
  return {
    simulationId: run.id,
    status: run.status,
    startedAt: run.startedAt,
    endedAt: run.endedAt,
    config: run.config,
    patientIds: run.patientIds,
    stats: run.stats,
    error: run.error
  };
}

async function publishStatus(run: SimulationRun, stage: string, details?: Record<string, unknown>) {
  await eventBus.publish(Topics.simulationStatus, {
    simulationId: run.id,
    status: run.status,
    stage,
    at: new Date().toISOString(),
    stats: run.stats,
    details: details ?? {}
  });
}

async function createSyntheticPatients(run: SimulationRun, rng: () => number): Promise<SyntheticPatient[]> {
  const now = Date.now();
  const out: SyntheticPatient[] = [];
  for (let i = 0; i < run.config.patientCount; i += 1) {
    const highRisk = rng() < run.config.severityProfile.highRiskPct / 100;
    const seed = `${run.id.split("-")[0]}-${i + 1}`;
    const firstName = highRisk ? "Critical" : "Stable";
    const lastName = `Sim${i + 1}`;
    const patient = await ehrService.createPatient({
      mrn: `SIM-${seed}-${now.toString().slice(-6)}`,
      firstName,
      lastName,
      dateOfBirth: new Date(calcDobYear(highRisk, rng), Math.floor(rng() * 12), 1 + Math.floor(rng() * 27)),
      sex: rng() < 0.5 ? "male" : "female",
      allergies: highRisk ? ["penicillin"] : [],
      comorbidities: highRisk ? ["hypertension", "diabetes"] : rng() < 0.3 ? ["asthma"] : []
    });

    const fhir = await ehrService.getPatientFhir(String(patient._id));
    await eventBus.publish(Topics.fhirNormalized, {
      simulationId: run.id,
      patientId: String(patient._id),
      resourceType: fhir.resourceType,
      at: new Date().toISOString()
    });

    out.push({
      patientId: String(patient._id),
      mrn: patient.mrn,
      fullName: `${patient.lastName} ${patient.firstName}`,
      highRisk
    });
  }
  return out;
}

async function executeSimulation(run: SimulationRun) {
  const rng = buildRng(run.config.seed);
  try {
    run.status = "running";
    await publishStatus(run, "initializing");

    const patients = await createSyntheticPatients(run, rng);
    run.patientIds = patients.map((p) => p.patientId);
    await publishStatus(run, "patients_ready", { patientCount: patients.length });

    const ticks = Math.max(1, Math.ceil((run.config.durationSeconds * 1000) / run.config.updateIntervalMs));

    for (let tick = 1; tick <= ticks; tick += 1) {
      for (const patient of patients) {
        const severity = pickSeverity(patient.highRisk, rng);
        const observedAt = new Date().toISOString();
        const vitals = makeVitals(severity, rng);
        const labs = makeLabs(severity, rng);
        const drugs = makeDrugs(severity, rng);
        const noteText = makeClinicalNote(patient, severity, tick);

        await vitalsService.createRecord({
          patientId: patient.patientId,
          recordedAt: observedAt,
          ...vitals
        });
        run.stats.vitalsRecords += 1;

        const hl7 = buildHl7Message({
          mrn: patient.mrn,
          fullName: patient.fullName,
          observedAt,
          values: labs
        });
        await labService.ingestHl7({
          message: hl7,
          reportType: "SIM_LAB",
          reportedAt: observedAt
        });
        run.stats.labReports += 1;

        await pharmacyService.checkPrescription({
          patientId: patient.patientId,
          drugs,
          noteText: "Simulation medication order"
        });
        run.stats.pharmacyOrders += 1;

        await eventBus.publish(Topics.clinicalNoteReceived, {
          patientId: patient.patientId,
          noteText,
          source: "simulation",
          at: observedAt
        });
        run.stats.clinicalNotes += 1;

        const decision = await runClinicalDecisionCycle({
          patientId: patient.patientId,
          noteText,
          vitals,
          drugs
        });
        run.stats.decisions += 1;
        if (decision.riskLevel === "high") run.stats.highRiskDecisions += 1;
        if (decision.safetyGate.attendingApprovalRequired) run.stats.attendingEscalations += 1;
      }

      run.stats.ticksProcessed = tick;
      await publishStatus(run, "tick_complete", { tick, totalTicks: ticks });
      if (tick < ticks) await wait(run.config.updateIntervalMs);
    }

    run.status = "completed";
    run.endedAt = new Date().toISOString();
    await publishStatus(run, "completed");
  } catch (error) {
    run.status = "failed";
    run.endedAt = new Date().toISOString();
    run.error = error instanceof Error ? error.message : "Simulation failed";
    await publishStatus(run, "failed", { error: run.error });
  }
}

function startSimulation(input: StartSimulationInput) {
  const run: SimulationRun = {
    id: uuidv4(),
    status: "starting",
    config: input,
    startedAt: new Date().toISOString(),
    endedAt: null,
    patientIds: [],
    stats: {
      ticksProcessed: 0,
      vitalsRecords: 0,
      labReports: 0,
      pharmacyOrders: 0,
      clinicalNotes: 0,
      decisions: 0,
      highRiskDecisions: 0,
      attendingEscalations: 0
    },
    error: null
  };
  runs.set(run.id, run);
  void executeSimulation(run);
  return snapshot(run);
}

function getSimulation(simulationId: string) {
  const run = runs.get(simulationId);
  return run ? snapshot(run) : null;
}

export const simulationService = {
  startSimulation,
  getSimulation
};
