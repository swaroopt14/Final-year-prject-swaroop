"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AlertItem = { type: string; at: number; payload: unknown };

export function useAlertsStream({ token }: { token: string }) {
  const [connected, setConnected] = useState(false);
  const [items, setItems] = useState<AlertItem[]>([]);
  const esRef = useRef<EventSource | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3000";

  useEffect(() => {
    if (!token) {
      setConnected(false);
      setItems([]);
      if (esRef.current) esRef.current.close();
      esRef.current = null;
      return;
    }

    const url = `${baseUrl}/api/events/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    esRef.current = es;

    const onOpen = () => setConnected(true);
    const onError = () => setConnected(false);

    const handlers = ["vitals.stream", "high_risk_alert", "drug_alert"].map((type) => {
      const handler = (e: MessageEvent) => {
        let payload: unknown = e.data;
        try {
          payload = JSON.parse(e.data);
        } catch {}
        setItems((prev) => [{ type, at: Date.now(), payload }, ...prev].slice(0, 200));
      };
      es.addEventListener(type, handler);
      return { type, handler };
    });

    es.addEventListener("connected", () => setConnected(true));
    es.addEventListener("ping", () => setConnected(true));
    es.addEventListener("open", onOpen as any);
    es.addEventListener("error", onError as any);

    return () => {
      es.removeEventListener("open", onOpen as any);
      es.removeEventListener("error", onError as any);
      for (const h of handlers) es.removeEventListener(h.type, h.handler as any);
      es.close();
      esRef.current = null;
    };
  }, [token, baseUrl]);

  return useMemo(() => ({ connected, items }), [connected, items]);
}

