import { eventBus } from "../../events/index.js";
import { Topics } from "../../events/topics.js";
import { QLearningService } from "../../ai/rl/qlearning.service.js";
import { isHighRiskVitals } from "../../utils/risk.calculator.js";
import type { VitalsStreamEvent } from "./agent.types.js";

export class NurseAgent {
  private q = new QLearningService<"stable" | "alert", "observe" | "escalate">();

  async onVitalsStream(evt: VitalsStreamEvent) {
    const highRisk = isHighRiskVitals({
      heartRateBpm: evt.heartRateBpm,
      systolicMmHg: evt.systolicMmHg,
      diastolicMmHg: evt.diastolicMmHg,
      spo2Pct: evt.spo2Pct,
      temperatureC: evt.temperatureC
    });

    // Keep a simple resident-style adaptation loop; remote RL service is best-effort.
    await this.q.updateAndSync(
      highRisk ? "alert" : "stable",
      highRisk ? "escalate" : "observe",
      highRisk ? 1 : 0,
      highRisk ? "alert" : "stable"
    );

    if (!highRisk) return;

    await eventBus.publish(Topics.highRiskAlert, {
      patientId: evt.patientId,
      source: "nurse",
      reason: "Abnormal vitals detected",
      at: new Date().toISOString()
    });
  }
}
