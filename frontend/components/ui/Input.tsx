import clsx from "clsx";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={clsx(
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-sky-200",
        className
      )}
      {...props}
    />
  );
}

