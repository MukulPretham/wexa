import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-100 text-zinc-900 hover:bg-white focus-visible:ring-zinc-400",
  secondary:
    "border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 focus-visible:ring-zinc-600",
  ghost:
    "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:ring-zinc-600",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
};

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleOptions;

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
