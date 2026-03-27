import { eventBus } from "../../events/index.js";
import { Topics } from "../../events/topics.js";
import type { DrugAlertEvent, HighRiskAlertEvent, VitalsStreamEvent } from "./agent.types.js";
import { AdminAgent } from "./admin.agent.js";
import { ChiefAgent } from "./chief.agent.js";
import { DoctorAgent } from "./doctor.agent.js";
import { DrugCheckerAgent } from "./drugchecker.agent.js";
import { NurseAgent } from "./nurse.agent.js";
import type { ChiefConsensus, DoctorEvaluation, SafetyGate } from "./agent.types.js";

export class AgentOrchestrator {
  private admin = new AdminAgent();
  private chief = new ChiefAgent();
  private nurse = new NurseAgent();
  private doctor = new DoctorAgent();
  private drugChecker = new DrugCheckerAgent();

  start() {
    eventBus.subscribe<VitalsStreamEvent>(Topics.vitalsStream, async (evt) => {
      await this.admin.log({ agent: "nurse", topic: Topics.vitalsStream, payload: evt });
      await this.nurse.onVitalsStream(evt);
    });

    eventBus.subscribe<HighRiskAlertEvent>(Topics.highRiskAlert, async (evt) => {
      await this.admin.log({ agent: "admin", topic: Topics.highRiskAlert, payload: evt });
    });

    eventBus.subscribe<DrugAlertEvent>(Topics.drugAlert, async (evt) => {
      await this.admin.log({ agent: "drugchecker", topic: Topics.drugAlert, payload: evt });
      await this.drugChecker.onDrugAlert(evt);
    });
  }

  getDoctorAgent() {
    return this.doctor;
  }

  getChiefAgent() {
    return this.chief;
  }

  async logClinicalDecision(entry: {
    patientId: string;
    doctor: DoctorEvaluation;
    chiefConsensus: ChiefConsensus;
    safetyGate: SafetyGate;
  }) {
    await this.admin.log({
      agent: "chief",
      topic: "agents.clinical_decision",
      payload: {
        patientId: entry.patientId,
        doctor: entry.doctor,
        chiefConsensus: entry.chiefConsensus,
        safetyGate: entry.safetyGate,
        at: new Date().toISOString()
      }
    });
  }

  async listClinicalDecisions(params?: {
    patientId?: string;
    from?: Date;
    to?: Date;
    limit?: number;
    cursor?: string;
  }) {
    return this.admin.listClinicalDecisions(params);
  }
}
