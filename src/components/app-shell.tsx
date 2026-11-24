import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/(auth)/actions";
import { NavLink } from "@/components/nav-link";
import { Button } from "@/components/ui/button";

type AppShellProps = {
  organizationName: string;
  userEmail: string;
  children: ReactNode;
};

export function AppShell({
  organizationName,
  userEmail,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row">
      <header className="flex h-16 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 lg:hidden">
        <Link
          href="/dashboard"
          className="text-sm font-semibold tracking-tight text-zinc-900"
        >
          StockFlow
        </Link>
        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            <NavLink href="/dashboard" compact>
              Dashboard
            </NavLink>
            <NavLink href="/products" compact>
              Products
            </NavLink>
            <NavLink href="/settings" compact>
              Settings
            </NavLink>
          </nav>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="px-2 text-xs"
            >
              Log out
            </Button>
          </form>
        </div>
      </header>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-zinc-200 px-6">
          <Link
            href="/dashboard"
            className="text-base font-semibold tracking-tight text-zinc-900"
          >
            StockFlow
          </Link>
        </div>

        <div className="px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Workspace
          </p>
          <p className="mt-1 truncate text-sm font-medium text-zinc-900">
            {organizationName}
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/settings">Settings</NavLink>
        </nav>

        <div className="border-t border-zinc-200 p-4">
          <p className="truncate px-1 text-xs text-zinc-500">{userEmail}</p>
          <form action={logoutAction} className="mt-3">
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              className="w-full"
            >
              Log out
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
