"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { tokenStore } from "@/lib/tokenStore";

type Sex = "male" | "female" | "other" | "unknown";

function asList(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function AddPatientPanel() {
  const [token] = useState(() => tokenStore.get());
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const [mrn, setMrn] = useState("MRN-");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("1990-01-01");
  const [sex, setSex] = useState<Sex>("unknown");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [allergies, setAllergies] = useState("penicillin");
  const [comorbidities, setComorbidities] = useState("HTN, Type 2 DM");

  const canSubmit = useMemo(() => {
    return mrn.trim().length >= 3 && firstName.trim().length > 0 && lastName.trim().length > 0 && !!dateOfBirth && !saving;
  }, [mrn, firstName, lastName, dateOfBirth, saving]);

  async function submit() {
    if (!canSubmit) return;
    setSaving(true);
    setResult(null);
    const body = {
      mrn: mrn.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth,
      sex,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      allergies: asList(allergies),
      comorbidities: asList(comorbidities)
    };

    if (!token) {
      await new Promise((r) => setTimeout(r, 350));
      setResult({ ok: true, message: "Mock saved. Add a token + run API to persist." });
      setSaving(false);
      return;
    }

    try {
      api.setToken(token);
      await api.post("/api/ehr/patients", body);
      setResult({ ok: true, message: "Patient created." });
    } catch (e: any) {
      const msg = String(e?.message || e);
      setResult({
        ok: false,
        message: msg.includes("403") ? "Forbidden: only admin can create patients (backend RBAC)." : msg
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title="Add Patient"
        subtitle="Register a new patient record (RBAC: backend allows admin only)"
        right={<Badge tone={token ? "green" : "yellow"}>{token ? "Authenticated" : "Mock Data"}</Badge>}
      />
      <CardBody className="space-y-4">
        {result ? (
          <div className={`rounded-2xl border p-4 text-sm ${result.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
            {result.message}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">MRN</div>
            <Input value={mrn} onChange={(e) => setMrn(e.target.value)} placeholder="MRN-000001" />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">Date of Birth</div>
            <Input value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} type="date" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">First Name</div>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Aarav" />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">Last Name</div>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Patil" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">Sex</div>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as Sex)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-sky-200"
            >
              <option value="unknown">unknown</option>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="other">other</option>
            </select>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">Phone</div>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 0100" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="text-xs font-semibold text-slate-600">Address</div>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="min-h-[80px]" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="text-xs font-semibold text-slate-600">Allergies (comma separated)</div>
            <Input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="penicillin, latex" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <div className="text-xs font-semibold text-slate-600">Comorbidities (comma separated)</div>
            <Input value={comorbidities} onChange={(e) => setComorbidities(e.target.value)} placeholder="HTN, Type 2 DM" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => setResult(null)} disabled={saving}>
            Reset Message
          </Button>
          <Button variant="primary" onClick={submit} disabled={!canSubmit}>
            {saving ? "Saving…" : "Create Patient"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

