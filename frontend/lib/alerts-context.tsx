"use client";

import { createContext, useContext } from "react";

type AlertItem = { type: string; at: number; payload: unknown };

export type AlertsState = {
  connected: boolean;
  items: AlertItem[];
};

const AlertsContext = createContext<AlertsState | null>(null);

export function AlertsProvider({ value, children }: { value: AlertsState; children: React.ReactNode }) {
  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts() {
  const v = useContext(AlertsContext);
  if (!v) return { connected: false, items: [] as AlertItem[] };
  return v;
}

