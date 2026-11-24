"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  compact?: boolean;
  children: ReactNode;
};

export function NavLink({ href, compact = false, children }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "block rounded-md font-medium transition-colors",
        compact ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm",
        active
          ? "bg-zinc-800 text-zinc-50"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
      )}
    >
      {children}
    </Link>
  );
}
