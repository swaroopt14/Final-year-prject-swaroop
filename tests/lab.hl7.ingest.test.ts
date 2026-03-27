import { describe, expect, it, vi } from "vitest";
import { createMockRes, createNext } from "./helpers/http.js";

const { ingestHl7Mock } = vi.hoisted(() => ({
  ingestHl7Mock: vi.fn()
}));

vi.mock("../src/modules/lab/lab.service.js", () => ({
  labService: {
    createReport: vi.fn(),
    listReportsByPatient: vi.fn(),
    ingestHl7: ingestHl7Mock
  }
}));

import { labController } from "../src/modules/lab/lab.controller.js";
import { ingestHl7Schema } from "../src/modules/lab/lab.validation.js";

describe("labController.ingestHl7Message", () => {
  it("ingests hl7 and persists report", async () => {
    ingestHl7Mock.mockResolvedValueOnce({
      report: { _id: "r1", reportType: "HL7_CBC" },
      parsed: { segments: [{ name: "PID", fields: ["PID", "1", "", "MRN-1001"] }] }
    });

    const { res, state } = createMockRes();
    const next = createNext();
    await labController.ingestHl7Message(
      {
        body: {
          reportType: "HL7_CBC",
          message:
            "MSH|^~\\&|LAB|HOSP|EHR|HOSP|202603061200||ORU^R01|MSG2|P|2.3\rPID|1||MRN-1001||Patel^Aarav\rOBX|1|NM|hgb^Hemoglobin||11.4|g/dL"
        }
      } as any,
      res as any,
      next as any
    );

    expect(next).not.toHaveBeenCalled();
    expect(state.statusCode).toBe(201);
    expect((state.body as any).data.report.reportType).toBe("HL7_CBC");
    expect(ingestHl7Mock).toHaveBeenCalledTimes(1);
  });

  it("validates payload schema", () => {
    const parsed = ingestHl7Schema.safeParse({
      reportType: "HL7_CBC"
    });

    expect(parsed.success).toBe(false);
  });
});
