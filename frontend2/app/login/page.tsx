"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Fingerprint, Loader2, Shield } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import {
  demoCredentials,
  roleHomePath,
  type LoginResponse,
  type UserRole,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

const roles: UserRole[] = ["doctor", "nurse", "admin"];

export default function LoginPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(role: UserRole) {
    const creds = demoCredentials[role];
    setActiveRole(role);
    setError(null);

    try {
      await api<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: creds.email, password: creds.password }),
      });
      router.push(roleHomePath);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unable to sign in. Is the API running on port 3000?";
      setError(message);
    } finally {
      setActiveRole(null);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#ede9fe_0%,_#f8fafc_45%,_#ffffff_100%)] px-6 py-12">
      <div className="w-full max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-violet-600">
            SmartCare+ Secure Access
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">Identity verification</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            Biometric hardware is out of scope for this MVP. Software-side we enforce JWT role claims
            and department ABAC — pick a station to continue.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {roles.map((role) => {
            const creds = demoCredentials[role];
            const busy = activeRole === role;

            return (
              <button
                key={role}
                type="button"
                disabled={busy || activeRole !== null}
                onClick={() => signIn(role)}
                className={cn(
                  "group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 text-left shadow-sm transition",
                  "hover:border-violet-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                  busy && "border-violet-400 ring-2 ring-violet-300",
                )}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 opacity-0 transition group-hover:opacity-100" />
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-700">
                    {creds.label}
                  </span>
                  {busy ? (
                    <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
                  ) : (
                    <Fingerprint className="h-5 w-5 text-slate-300 transition group-hover:text-violet-500" />
                  )}
                </div>

                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="relative grid h-28 w-28 place-items-center rounded-full border border-slate-200 bg-slate-50">
                    {creds.image ? (
                      <Image
                        src={creds.image}
                        alt={creds.label}
                        width={96}
                        height={96}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <Shield className="h-12 w-12 text-violet-500" />
                    )}
                    <span className="absolute inset-0 rounded-full ring-2 ring-violet-200/60 ring-offset-2 ring-offset-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-900">{creds.label} station</div>
                    <p className="mt-1 text-sm text-slate-500">{creds.subtitle}</p>
                    <p className="mt-3 font-mono text-[11px] text-slate-400">{creds.email}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
                  Tap to scan &amp; sign in with demo credentials
                </div>
              </button>
            );
          })}
        </div>

        {error ? (
          <p className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm text-rose-700">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
