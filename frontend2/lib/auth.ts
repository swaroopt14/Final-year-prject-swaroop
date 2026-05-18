import type { PageSlug } from "@/lib/hospital-data";

export type UserRole = "doctor" | "nurse" | "admin";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
};

export type LoginResponse = {
  token: string;
  user: SessionUser;
};

export const roleHomePath = "/dashboard" as const;

export const demoCredentials: Record<
  UserRole,
  { email: string; password: string; label: string; subtitle: string; image?: string }
> = {
  doctor: {
    email: "dr.rao@smartcare.dev",
    password: "demo1234",
    label: "Doctor",
    subtitle: "Neurology · stroke pathway",
    image: "/doctor.png",
  },
  nurse: {
    email: "nurse.priya@smartcare.dev",
    password: "demo1234",
    label: "Nurse",
    subtitle: "Emergency triage",
    image: "/nurse.png",
  },
  admin: {
    email: "admin@smartcare.dev",
    password: "demo1234",
    label: "Admin",
    subtitle: "Operations & audit",
  },
};

const adminOnlySlugs: PageSlug[] = ["admin-agent", "logs", "model-insights", "hospital-load"];

export function isNavVisible(role: UserRole, slug: PageSlug): boolean {
  if (role === "admin") return true;
  if (adminOnlySlugs.includes(slug)) return false;
  if (role === "nurse" && slug === "doctor-agent") return false;
  if (role === "doctor" && slug === "nurse-agent") return false;
  return true;
}

export function userInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function roleGreeting(role: UserRole): string {
  if (role === "nurse") return "Nurse station";
  if (role === "admin") return "Command center";
  return "Clinical cockpit";
}
