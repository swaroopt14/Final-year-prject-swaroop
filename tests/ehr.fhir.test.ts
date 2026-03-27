import { describe, expect, it, vi } from "vitest";
import { createMockRes, createNext } from "./helpers/http.js";

const { getPatientFhirMock } = vi.hoisted(() => ({
  getPatientFhirMock: vi.fn()
}));

vi.mock("../src/modules/ehr/ehr.service.js", () => ({
  ehrService: {
    listPatients: vi.fn(),
    getPatient: vi.fn(),
    createPatient: vi.fn(),
    updatePatient: vi.fn(),
    getPatientFhir: getPatientFhirMock
  }
}));

import { ehrController } from "../src/modules/ehr/ehr.controller.js";

describe("ehrController.getPatientFhir", () => {
  it("returns fhir patient resource", async () => {
    getPatientFhirMock.mockResolvedValueOnce({
      resourceType: "Patient",
      id: "65f0abc",
      identifier: [{ system: "urn:mrn", value: "MRN-1001" }]
    });

    const { res, state } = createMockRes();
    const next = createNext();
    await ehrController.getPatientFhir(
      {
        params: { id: "65f0abc" }
      } as any,
      res as any,
      next as any
    );

    expect(next).not.toHaveBeenCalled();
    expect(state.statusCode).toBe(200);
    expect((state.body as any).data.resourceType).toBe("Patient");
    expect(getPatientFhirMock).toHaveBeenCalledWith("65f0abc");
  });
});
