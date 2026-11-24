import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-zinc-200"
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-zinc-500">{hint}</p>
      ) : null}
      {error ? <p className="text-xs font-medium text-red-400">{error}</p> : null}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
    >
      {message}
    </p>
  );
}
