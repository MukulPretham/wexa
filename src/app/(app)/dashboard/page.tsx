import type { Metadata } from "next";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard — StockFlow",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const organizationId = session.organization.id;

  const [productCount, stockAggregate] = await Promise.all([
    prisma.product.count({ where: { organizationId } }),
    prisma.product.aggregate({
      where: { organizationId },
      _sum: { quantityOnHand: true },
    }),
  ]);

  const totalUnits = stockAggregate._sum.quantityOnHand ?? 0;

  return (
    <div className="px-6 py-8 lg:px-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Overview of {session.organization.name}.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:max-w-2xl">
        <StatCard
          label="Products"
          value={productCount}
          hint="Unique SKUs in your catalog"
        />
        <StatCard
          label="Units on hand"
          value={totalUnits}
          hint="Total quantity across all products"
        />
      </div>
    </div>
  );
}
