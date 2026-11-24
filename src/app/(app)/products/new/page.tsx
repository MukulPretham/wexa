import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/products/product-form";
import { createProductAction } from "../actions";

export const metadata: Metadata = {
  title: "Add product — StockFlow",
};

export default function NewProductPage() {
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
          Add product
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Create a product with its stock and pricing details.
        </p>

        <div className="mt-8">
          <ProductForm mode="create" action={createProductAction} />
        </div>
      </div>
    </div>
  );
}
