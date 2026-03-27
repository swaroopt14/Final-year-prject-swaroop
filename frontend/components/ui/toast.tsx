import clsx from "clsx";

export type ToastProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export type ToastActionElement = React.ReactElement;

export function Toast({ className, children }: ToastProps & { children?: React.ReactNode }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 shadow-[0_18px_50px_rgba(2,8,23,0.45)]",
        className
      )}
    >
      {children}
    </div>
  );
}
