"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { tokenStore } from "@/lib/tokenStore";
import clsx from "clsx";
import { PatientDrawer } from "@/components/pages/PatientDrawer";
import { mockPatients } from "@/lib/mockData";

type Patient = {
  _id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  comorbidities?: string[];
};

type RiskBand = "All" | "High" | "Medium" | "Low";
type SortKey = "name" | "mrn" | "age" | "risk";
type SortDir = "asc" | "desc";

function calcAge(dateOfBirth: string) {
  const dob = new Date(dateOfBirth).getTime();
  if (Number.isNaN(dob)) return 0;
  return Math.floor((Date.now() - dob) / 31_557_600_000);
}

function mockRiskScore(p: Patient) {
  const age = calcAge(p.dateOfBirth);
  const c = Array.isArray(p.comorbidities) ? p.comorbidities.length : 0;
  const base = Math.min(0.95, Math.max(0.05, (age / 100) * 0.6 + (c / 6) * 0.4));
  return Math.round(base * 100) / 100;
}

function riskTone(score: number) {
  if (score >= 0.8) return "red" as const;
  if (score >= 0.5) return "yellow" as const;
  return "green" as const;
}

function riskBand(score: number): Exclude<RiskBand, "All"> {
  if (score >= 0.8) return "High";
  if (score >= 0.5) return "Medium";
  return "Low";
}

export function PatientListPanel() {
  const [token] = useState(() => tokenStore.get());
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [q, setQ] = useState("");
  const [band, setBand] = useState<RiskBand>("All");
  const [sex, setSex] = useState<"All" | "M" | "F">("All");
  const [sortKey, setSortKey] = useState<SortKey>("risk");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedId, setSelectedId] = useState<string>("");

  const selectedPatient = useMemo(
    () => patients.find((p) => p._id === selectedId) ?? null,
    [patients, selectedId]
  );

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setPatients(mockPatients as unknown as Patient[]);
      return;
    }
    setLoading(true);
    api.setToken(token);
    api
      .get<{ data: Patient[] }>("/api/ehr/patients")
      .then((r) => {
        if (cancelled) return;
        setPatients(r.data ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setPatients(mockPatients as unknown as Patient[]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const rows = useMemo(() => {
    const norm = q.trim().toLowerCase();
    const computed = patients
      .map((p) => {
        const score = mockRiskScore(p);
        return { p, score };
      })
      .filter(({ p, score }) => {
        if (band !== "All" && riskBand(score) !== band) return false;
        if (sex !== "All" && p.sex !== sex) return false;
        if (!norm) return true;
        const name = `${p.firstName} ${p.lastName}`.toLowerCase();
        return name.includes(norm) || p.mrn?.toLowerCase().includes(norm);
      });

    const dir = sortDir === "asc" ? 1 : -1;
    computed.sort((a, b) => {
      if (sortKey === "risk") return (a.score - b.score) * dir;
      if (sortKey === "age") return (calcAge(a.p.dateOfBirth) - calcAge(b.p.dateOfBirth)) * dir;
      if (sortKey === "mrn") return (a.p.mrn || "").localeCompare(b.p.mrn || "") * dir;
      const an = `${a.p.firstName} ${a.p.lastName}`.toLowerCase();
      const bn = `${b.p.firstName} ${b.p.lastName}`.toLowerCase();
      return an.localeCompare(bn) * dir;
    });
    return computed;
  }, [patients, q, band, sex, sortKey, sortDir]);

  function toggleSort(nextKey: SortKey) {
    if (sortKey !== nextKey) {
      setSortKey(nextKey);
      setSortDir(nextKey === "risk" ? "desc" : "asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }

  return (
    <Card>
      <CardHeader
        title="Patients"
        subtitle="Search, filter, and prioritize by AI risk (demo scoring)"
        right={
          <div className="flex items-center gap-2">
            <Badge tone={token ? "green" : "yellow"}>{token ? "Authenticated" : "Mock Data"}</Badge>
            <Badge tone="slate">{patients.length} total</Badge>
          </div>
        }
      />
      <CardBody className="space-y-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-[420px]">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or MRN…" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["All", "High", "Medium", "Low"] as RiskBand[]).map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setBand(x)}
                className={clsx(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  band === x ? "border-sky-200 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                {x} Risk
              </button>
            ))}
            {(["All", "M", "F"] as const).map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setSex(x)}
                className={clsx(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  sex === x ? "border-sky-200 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                Sex: {x}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <button type="button" className="col-span-4 text-left hover:text-slate-700" onClick={() => toggleSort("name")}>
              Patient {sortKey === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </button>
            <button type="button" className="col-span-2 text-left hover:text-slate-700" onClick={() => toggleSort("mrn")}>
              MRN {sortKey === "mrn" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </button>
            <button type="button" className="col-span-2 text-left hover:text-slate-700" onClick={() => toggleSort("age")}>
              Age {sortKey === "age" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </button>
            <button type="button" className="col-span-2 text-left hover:text-slate-700" onClick={() => toggleSort("risk")}>
              Risk Score {sortKey === "risk" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </button>
            <div className="col-span-2 text-right">Action</div>
          </div>

          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="px-4 py-10 text-sm text-slate-600">Loading patients…</div>
            ) : rows.length === 0 ? (
              <div className="px-4 py-10 text-sm text-slate-600">
                No patients found.
              </div>
            ) : (
              rows.map(({ p, score }) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => setSelectedId(p._id)}
                  className="grid w-full grid-cols-12 items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  <div className="col-span-4 min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">
                      {p.firstName} {p.lastName}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-slate-500">
                      {Array.isArray(p.comorbidities) && p.comorbidities.length ? p.comorbidities.join(", ") : "No comorbidities listed"}
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-slate-700">{p.mrn || "—"}</div>
                  <div className="col-span-2 text-sm text-slate-700">{calcAge(p.dateOfBirth)}</div>
                  <div className="col-span-2">
                    <Badge tone={riskTone(score)}>{score.toFixed(2)}</Badge>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="secondary" size="sm" disabled>
                      View
                    </Button>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <PatientDrawer
          open={!!selectedId}
          token={token}
          patient={selectedPatient}
          onClose={() => setSelectedId("")}
        />
      </CardBody>
    </Card>
  );
}
