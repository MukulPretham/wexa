import type { Metadata } from "next";
import Link from "next/link";
import { AdjustStockButton } from "@/components/products/adjust-stock-button";
import { DeleteProductButton } from "@/components/products/delete-product-button";
import { StockBadge } from "@/components/products/stock-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireSession } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Products — StockFlow",
};

type ProductsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const session = await requireSession();
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const organizationId = session.organization.id;

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where: {
        organizationId,
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" as const } },
                { sku: { contains: query, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
    }),
    prisma.product.count({ where: { organizationId } }),
  ]);

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            {totalProducts === 0
              ? "No products yet."
              : `${totalProducts} product${totalProducts === 1 ? "" : "s"} in your catalog.`}
          </p>
        </div>
        <Link href="/products/new" className={buttonVariants()}>
          Add product
        </Link>
      </div>

      <form action="/products" method="get" className="mt-6 flex gap-2">
        <Input
          name="q"
          defaultValue={query}
          placeholder="Search by name or SKU"
          className="max-w-xs"
          aria-label="Search products"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
        {query ? (
          <Link
            href="/products"
            className="inline-flex items-center px-2 text-sm text-zinc-500 hover:text-zinc-900"
          >
            Clear
          </Link>
        ) : null}
      </form>

      {totalProducts === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-zinc-900">No products yet</p>
          <p className="mt-1 text-sm text-zinc-500">
            Products you add will show up here with their stock levels.
          </p>
          <Link
            href="/products/new"
            className={buttonVariants({ className: "mt-5" })}
          >
            Add your first product
          </Link>
        </div>
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-zinc-900">
            No products match “{query}”
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Try a different name or SKU.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Selling price
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900">
                        {product.name}
                      </p>
                      {product.description ? (
                        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                          {product.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-600">
                      {product.sku}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-900">
                      {product.quantityOnHand}
                    </td>
                    <td className="px-4 py-3">
                      <StockBadge
                        quantityOnHand={product.quantityOnHand}
                        lowStockThreshold={product.lowStockThreshold}
                        organizationDefault={
                          session.organization.defaultLowStockThreshold
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-900">
                      {formatCurrency(product.sellingPrice?.toString())}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                        >
                          Edit
                        </Link>
                        <AdjustStockButton
                          productId={product.id}
                          productName={product.name}
                          quantityOnHand={product.quantityOnHand}
                        />
                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
