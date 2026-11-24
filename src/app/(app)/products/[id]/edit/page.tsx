import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateProductAction } from "../../actions";

export const metadata: Metadata = {
  title: "Edit product — StockFlow",
};

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const session = await requireSession();
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      id,
      organizationId: session.organization.id,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="max-w-2xl">
        <Link
          href="/products"
          className="text-sm text-zinc-400 hover:text-zinc-100"
        >
          ← Back to products
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-50">
          Edit product
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Update stock, pricing, or the low-stock threshold.
        </p>

        <div className="mt-8">
          <ProductForm
            mode="edit"
            action={updateProductAction}
            product={{
              id: product.id,
              name: product.name,
              sku: product.sku,
              description: product.description,
              quantityOnHand: product.quantityOnHand,
              costPrice: product.costPrice?.toString() ?? null,
              sellingPrice: product.sellingPrice?.toString() ?? null,
              lowStockThreshold: product.lowStockThreshold,
            }}
          />
        </div>
      </div>
    </div>
  );
}
