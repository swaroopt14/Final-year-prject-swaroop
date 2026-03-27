import type { DrugAlertEvent, HighRiskAlertEvent, VitalsStreamEvent } from "../modules/agents/agent.types.js";
import { Topics } from "./topics.js";

export const AlertEvents = {
  vitalsStream: Topics.vitalsStream,
  highRiskAlert: Topics.highRiskAlert,
  drugAlert: Topics.drugAlert,
  labResultReceived: Topics.labResultReceived,
  pharmacyOrderPlaced: Topics.pharmacyOrderPlaced,
  clinicalNoteReceived: Topics.clinicalNoteReceived,
  fhirNormalized: Topics.fhirNormalized,
  simulationStatus: Topics.simulationStatus
} as const;

export type AlertEventPayloads = {
  [Topics.vitalsStream]: VitalsStreamEvent;
  [Topics.highRiskAlert]: HighRiskAlertEvent;
  [Topics.drugAlert]: DrugAlertEvent;
  [Topics.labResultReceived]: unknown;
  [Topics.pharmacyOrderPlaced]: unknown;
  [Topics.clinicalNoteReceived]: unknown;
  [Topics.fhirNormalized]: unknown;
  [Topics.simulationStatus]: unknown;
};
