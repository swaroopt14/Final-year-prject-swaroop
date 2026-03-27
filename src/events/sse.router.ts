import { Router } from "express";
import { authQueryMiddleware } from "../middleware/authQuery.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { subscribe } from "./event.consumer.js";
import { Topics } from "./topics.js";

export const eventsRouter = Router();

eventsRouter.get("/stream", authQueryMiddleware, requireRole(["doctor", "nurse", "admin"]), (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive"
  });

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  send("connected", { user: req.user });

  const unsubVitals = subscribe(Topics.vitalsStream, (payload) => send("vitals.stream", payload));
  const unsubHigh = subscribe(Topics.highRiskAlert, (payload) => send("high_risk_alert", payload));
  const unsubDrug = subscribe(Topics.drugAlert, (payload) => send("drug_alert", payload));
  const unsubLab = subscribe(Topics.labResultReceived, (payload) => send("lab.result.received", payload));
  const unsubOrder = subscribe(Topics.pharmacyOrderPlaced, (payload) => send("pharmacy.order.placed", payload));
  const unsubNote = subscribe(Topics.clinicalNoteReceived, (payload) => send("clinical.note.received", payload));
  const unsubFhir = subscribe(Topics.fhirNormalized, (payload) => send("fhir.normalized", payload));
  const unsubSimulation = subscribe(Topics.simulationStatus, (payload) => send("simulation.status", payload));

  const heartbeat = setInterval(() => {
    res.write(`event: ping\ndata: ${Date.now()}\n\n`);
  }, 25_000);

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubVitals();
    unsubHigh();
    unsubDrug();
    unsubLab();
    unsubOrder();
    unsubNote();
    unsubFhir();
    unsubSimulation();
    res.end();
  });
});
