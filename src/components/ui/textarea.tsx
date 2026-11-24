import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100",
        "placeholder:text-zinc-500",
        "focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700/60",
        "disabled:cursor-not-allowed disabled:bg-zinc-900/50 disabled:text-zinc-500",
        "aria-invalid:border-red-500/60 aria-invalid:focus:ring-red-500/20",
        className,
      )}
      {...props}
    />
  );
}
