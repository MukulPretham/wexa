import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
        "placeholder:text-zinc-400",
        "focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200",
        "disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500",
        "aria-invalid:border-red-400 aria-invalid:focus:ring-red-100",
        className,
      )}
      {...props}
    />
  );
}
