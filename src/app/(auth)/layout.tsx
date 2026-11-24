import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";

export const instant = false;

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="hidden w-1/2 flex-col justify-between border-r border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-12 text-zinc-50 lg:flex">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          StockFlow
        </Link>

        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Inventory, without the spreadsheet.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            Track products, quantities, and low-stock items for your
            organization in one place.
          </p>
        </div>

        <p className="text-xs text-zinc-600">
          Built for small teams and single-store sellers.
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 inline-block text-lg font-semibold tracking-tight text-zinc-100 lg:hidden"
          >
            StockFlow
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
