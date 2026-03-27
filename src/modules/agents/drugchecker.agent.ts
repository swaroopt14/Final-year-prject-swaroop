import type { DrugAlertEvent } from "./agent.types.js";

export class DrugCheckerAgent {
  async onDrugAlert(evt: DrugAlertEvent) {
    return {
      patientId: evt.patientId,
      flagged: evt.interactions.length > 0,
      interactions: evt.interactions
    };
  }
}

