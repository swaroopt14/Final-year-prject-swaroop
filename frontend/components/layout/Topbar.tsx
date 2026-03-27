import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function Topbar({
  title,
  subtitle,
  right
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="card px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xl font-semibold">{title}</div>
          {subtitle ? <div className="mt-0.5 text-sm text-slate-500">{subtitle}</div> : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="w-full sm:w-[240px]">
            <Input placeholder="Search" />
          </div>
          <Badge tone="slate">Today</Badge>
          <Button variant="primary">Export</Button>
          {right}
        </div>
      </div>
    </div>
  );
}

