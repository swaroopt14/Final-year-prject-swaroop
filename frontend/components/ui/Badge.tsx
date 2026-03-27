import clsx from "clsx";

export function Badge({
  children,
  tone = "slate",
  className
}: {
  children: React.ReactNode;
  tone?: "slate" | "green" | "red" | "yellow" | "sky";
  className?: string;
}) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-rose-100 text-rose-700",
    yellow: "bg-amber-100 text-amber-800",
    sky: "bg-sky-100 text-sky-800"
  };
  return (
    <span className={clsx("inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

