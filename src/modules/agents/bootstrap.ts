import { AgentOrchestrator } from "./agent.orchestrator.js";

let started = false;
export const orchestrator = new AgentOrchestrator();

export function bootstrapAgents() {
  if (started) return;
  started = true;
  orchestrator.start();
}

