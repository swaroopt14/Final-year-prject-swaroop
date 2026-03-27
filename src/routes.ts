import type { Express } from "express";
import { ehrRouter } from "./modules/ehr/index.js";
import { labRouter } from "./modules/lab/index.js";
import { vitalsRouter } from "./modules/vitals/index.js";
import { pharmacyRouter } from "./modules/pharmacy/index.js";
import { agentsRouter } from "./modules/agents/index.js";
import { eventsRouter } from "./events/sse.router.js";
import { simulationsRouter } from "./modules/simulations/index.js";

export function registerRoutes(app: Express) {
  app.use("/api/ehr", ehrRouter);
  app.use("/api/lab", labRouter);
  app.use("/api/vitals", vitalsRouter);
  app.use("/api/pharmacy", pharmacyRouter);
  app.use("/api/agents", agentsRouter);
  app.use("/api/simulations", simulationsRouter);
  app.use("/api/events", eventsRouter);
}
