import type { Metadata } from "next";
import { SettingsForm } from "./settings-form";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Settings — StockFlow",
};

export default async function SettingsPage() {
  const session = await requireSession();

  return (
    <div className="px-6 py-8 lg:px-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Defaults for {session.organization.name}.
        </p>
      </div>

      <section className="mt-6 max-w-xl rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-base font-semibold text-zinc-100">Inventory</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Configure how low-stock alerts are calculated.
        </p>

        <div className="mt-5">
          <SettingsForm
            defaultLowStockThreshold={
              session.organization.defaultLowStockThreshold
            }
          />
        </div>
      </section>
    </div>
  );
}
