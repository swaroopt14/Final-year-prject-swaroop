import clsx from "clsx";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("card", className)}>{children}</div>;
}

export function CardHeader({
  title,
  subtitle,
  right
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5">
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {subtitle ? <div className="mt-0.5 text-xs text-slate-500">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("px-5 pb-5 pt-4", className)}>{children}</div>;
}

