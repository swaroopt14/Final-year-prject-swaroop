export const Topics = {
  vitalsStream: "vitals.stream",
  highRiskAlert: "high_risk_alert",
  drugAlert: "drug_alert",
  labResultReceived: "lab.result.received",
  pharmacyOrderPlaced: "pharmacy.order.placed",
  clinicalNoteReceived: "clinical.note.received",
  fhirNormalized: "fhir.normalized",
  simulationStatus: "simulation.status"
} as const;

export type TopicName = (typeof Topics)[keyof typeof Topics];
