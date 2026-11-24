import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireSession } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/db";
import { isLowStock, resolveLowStockThreshold } from "@/lib/low-stock";

export const metadata: Metadata = {
  title: "Dashboard — StockFlow",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const organizationId = session.organization.id;
  const organizationDefault = session.organization.defaultLowStockThreshold;

  const [productCount, stockAggregate, products] = await Promise.all([
    prisma.product.count({ where: { organizationId } }),
    prisma.product.aggregate({
      where: { organizationId },
      _sum: { quantityOnHand: true },
    }),
    prisma.product.findMany({
      where: { organizationId },
      orderBy: [{ quantityOnHand: "asc" }, { name: "asc" }],
    }),
  ]);

  const totalUnits = stockAggregate._sum.quantityOnHand ?? 0;

  const lowStockProducts = products.filter((product) =>
    isLowStock(
      product.quantityOnHand,
      product.lowStockThreshold,
      organizationDefault,
    ),
  );

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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
        <StatCard
          label="Low stock items"
          value={lowStockProducts.length}
          hint="At or below their threshold"
        />
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Low stock items
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Products at or below their low-stock threshold.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            View all products
          </Link>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
            <p className="text-sm font-medium text-zinc-900">
              Nothing needs restocking
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              All products are above their low-stock thresholds.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">SKU</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Threshold
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {lowStockProducts.map((product) => {
                    const threshold = resolveLowStockThreshold(
                      product.lowStockThreshold,
                      organizationDefault,
                    );

                    return (
                      <tr key={product.id} className="hover:bg-zinc-50">
                        <td className="px-4 py-3 font-medium text-zinc-900">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-600">
                          {product.sku}
                        </td>
                        <td
                          className={cn(
                            "px-4 py-3 text-right font-medium tabular-nums",
                            product.quantityOnHand === 0
                              ? "text-red-600"
                              : "text-amber-700",
                          )}
                        >
                          {product.quantityOnHand}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-zinc-600">
                          {threshold}
                          {product.lowStockThreshold === null ? (
                            <span className="ml-1 text-xs text-zinc-400">
                              default
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
