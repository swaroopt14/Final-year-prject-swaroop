import type { Patient } from "../modules/ehr/ehr.model.js";

export function toFhirPatient(patient: Patient & { _id?: unknown }) {
  return {
    resourceType: "Patient",
    id: String((patient as any)._id ?? patient.mrn),
    identifier: [{ system: "urn:mrn", value: patient.mrn }],
    name: [{ family: patient.lastName, given: [patient.firstName] }],
    gender: patient.sex === "male" || patient.sex === "female" ? patient.sex : "unknown",
    birthDate: patient.dateOfBirth.toISOString().slice(0, 10)
  };
}

