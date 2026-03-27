import { describe, expect, it, vi } from "vitest";

const { findOneMock, createMock } = vi.hoisted(() => ({
  findOneMock: vi.fn(),
  createMock: vi.fn()
}));

vi.mock("../src/modules/ehr/ehr.model.js", () => ({
  PatientModel: {
    findOne: findOneMock
  }
}));

vi.mock("../src/modules/lab/lab.model.js", () => ({
  LabReportModel: {
    create: createMock
  }
}));

import { labService } from "../src/modules/lab/lab.service.js";
import { HttpError } from "../src/utils/httpError.js";

describe("labService.ingestHl7", () => {
  it("parses HL7, resolves patient by MRN, and stores numeric OBX values", async () => {
    findOneMock.mockReturnValueOnce({
      lean: () => ({
        exec: async () => ({ _id: "patient-1", mrn: "MRN-1001" })
      })
    });
    createMock.mockResolvedValueOnce({
      toObject: () => ({ _id: "lab-1", reportType: "HL7_CBC" })
    });

    const out = await labService.ingestHl7({
      reportType: "HL7_CBC",
      message:
        "MSH|^~\\&|LAB|HOSP|EHR|HOSP|202603061200||ORU^R01|MSG2|P|2.3\rPID|1||MRN-1001||Patel^Aarav\rOBX|1|NM|hgb^Hemoglobin||11.4|g/dL\rOBX|2|NM|wbc^WBC||7.2|10*3/uL\rNTE|1||Mild anemia suspected"
    });

    expect(findOneMock).toHaveBeenCalledWith({ mrn: "MRN-1001" });
    expect(createMock).toHaveBeenCalledTimes(1);
    const createdInput = createMock.mock.calls[0]?.[0] as any;
    expect(createdInput.values.hgb).toBe(11.4);
    expect(createdInput.values.wbc).toBe(7.2);
    expect(createdInput.summary).toContain("Mild anemia suspected");
    expect((out as any).report.reportType).toBe("HL7_CBC");
  });

  it("throws VALIDATION_ERROR when PID MRN is missing", async () => {
    await expect(
      labService.ingestHl7({
        reportType: "HL7_CBC",
        message: "MSH|^~\\&|LAB|HOSP|EHR|HOSP|202603061200||ORU^R01|MSG2|P|2.3\rOBX|1|NM|hgb^Hemoglobin||11.4|g/dL"
      })
    ).rejects.toMatchObject<Partial<HttpError>>({
      statusCode: 400,
      code: "VALIDATION_ERROR"
    });
  });
});
