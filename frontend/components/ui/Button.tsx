import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary: "bg-sky-600 text-white hover:bg-sky-700 shadow-sm",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700"
  };
  const sizes: Record<NonNullable<Props["size"]>, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm"
  };
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}

