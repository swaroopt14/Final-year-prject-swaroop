"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MockAlertItem, MockPatient } from "@/lib/mockData";
import { mockPatients } from "@/lib/mockData";

type PatientState = {
  heartRateBpm: number;
  systolicMmHg: number;
  diastolicMmHg: number;
  spo2Pct: number;
  temperatureC: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function jitter(n: number, by: number) {
  return n + (Math.random() * 2 - 1) * by;
}

function initState(): PatientState {
  return {
    heartRateBpm: 82 + Math.round(Math.random() * 12),
    systolicMmHg: 118 + Math.round(Math.random() * 10),
    diastolicMmHg: 76 + Math.round(Math.random() * 8),
    spo2Pct: 96 + Math.round(Math.random() * 2),
    temperatureC: 36.8 + Math.round(Math.random() * 4) / 10
  };
}

function isHighRisk(s: PatientState) {
  return s.spo2Pct < 92 || s.temperatureC >= 39 || s.systolicMmHg < 90 || s.heartRateBpm >= 130;
}

export function useMockVitalsSimulation({
  enabled,
  patients = mockPatients,
  intervalMs = 1200,
  maxItems = 200
}: {
  enabled: boolean;
  patients?: MockPatient[];
  intervalMs?: number;
  maxItems?: number;
}) {
  const [connected, setConnected] = useState(false);
  const [items, setItems] = useState<MockAlertItem[]>([]);
  const statesRef = useRef<Record<string, PatientState>>({});

  useEffect(() => {
    if (!enabled) {
      setConnected(false);
      setItems([]);
      statesRef.current = {};
      return;
    }

    setConnected(true);
    if (!Object.keys(statesRef.current).length) {
      for (const p of patients) statesRef.current[p._id] = initState();
    }

    const t = window.setInterval(() => {
      const now = Date.now();
      const nextEvents: MockAlertItem[] = [];

      for (const p of patients) {
        const prev = statesRef.current[p._id] ?? initState();

        // Random-walk with occasional adverse drift.
        const adverse = Math.random() < 0.04;
        const hr = clamp(Math.round(jitter(prev.heartRateBpm, adverse ? 14 : 6)), 45, 165);
        const sys = clamp(Math.round(jitter(prev.systolicMmHg, adverse ? 10 : 5)), 70, 170);
        const dia = clamp(Math.round(jitter(prev.diastolicMmHg, adverse ? 8 : 4)), 40, 110);
        const spo2 = clamp(Math.round(jitter(prev.spo2Pct, adverse ? 3 : 1)), 82, 100);
        const temp = clamp(Math.round(jitter(prev.temperatureC, adverse ? 0.6 : 0.2) * 10) / 10, 35.2, 40.6);

        const st: PatientState = { heartRateBpm: hr, systolicMmHg: sys, diastolicMmHg: dia, spo2Pct: spo2, temperatureC: temp };
        statesRef.current[p._id] = st;

        nextEvents.push({
          type: "vitals.stream",
          at: now,
          payload: { patientId: p._id, ...st }
        });

        if (isHighRisk(st) && Math.random() < 0.25) {
          nextEvents.push({
            type: "high_risk_alert",
            at: now,
            payload: {
              patientId: p._id,
              source: "nurse",
              reason: "Simulated abnormal vitals detected",
              riskScore: Math.round((0.75 + Math.random() * 0.2) * 100) / 100
            }
          });
        }
      }

      setItems((prev) => [...nextEvents, ...prev].slice(0, maxItems));
    }, intervalMs);

    return () => window.clearInterval(t);
  }, [enabled, intervalMs, maxItems, patients]);

  return useMemo(() => ({ connected, items }), [connected, items]);
}

