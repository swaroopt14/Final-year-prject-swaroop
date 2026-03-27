import clsx from "clsx";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: Props) {
  return (
    <textarea
      className={clsx(
        "min-h-[96px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-sky-200",
        className
      )}
      {...props}
    />
  );
}

