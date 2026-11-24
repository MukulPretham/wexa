"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormState } from "@/app/(app)/products/actions";

type ProductFormValues = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  quantityOnHand: number;
  costPrice: string | null;
  sellingPrice: string | null;
  lowStockThreshold: number | null;
};

type ProductFormProps = {
  action: (
    state: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  mode: "create" | "edit";
  product?: ProductFormValues;
};

const initialState: ProductFormState = null;

export function ProductForm({ action, mode, product }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const fieldErrors = state?.fieldErrors;

  return (
    <form action={formAction} className="max-w-2xl space-y-5" noValidate>
      {product ? (
        <input type="hidden" name="id" value={product.id} />
      ) : null}

      <FormError message={state?.error} />

      <Field label="Name" htmlFor="name" error={fieldErrors?.name?.[0]}>
        <Input
          id="name"
          name="name"
          defaultValue={product?.name}
          placeholder="Wireless Mouse"
          aria-invalid={Boolean(fieldErrors?.name)}
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="SKU"
          htmlFor="sku"
          hint="Unique within your organization."
          error={fieldErrors?.sku?.[0]}
        >
          <Input
            id="sku"
            name="sku"
            defaultValue={product?.sku}
            placeholder="WM-001"
            aria-invalid={Boolean(fieldErrors?.sku)}
            required
          />
        </Field>

        <Field
          label="Quantity on hand"
          htmlFor="quantityOnHand"
          error={fieldErrors?.quantityOnHand?.[0]}
        >
          <Input
            id="quantityOnHand"
            name="quantityOnHand"
            type="number"
            min={0}
            step={1}
            defaultValue={product?.quantityOnHand ?? 0}
            aria-invalid={Boolean(fieldErrors?.quantityOnHand)}
            required
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Cost price"
          htmlFor="costPrice"
          hint="Optional."
          error={fieldErrors?.costPrice?.[0]}
        >
          <Input
            id="costPrice"
            name="costPrice"
            type="number"
            min={0}
            step="0.01"
            defaultValue={product?.costPrice ?? ""}
            placeholder="8.50"
            aria-invalid={Boolean(fieldErrors?.costPrice)}
          />
        </Field>

        <Field
          label="Selling price"
          htmlFor="sellingPrice"
          hint="Optional."
          error={fieldErrors?.sellingPrice?.[0]}
        >
          <Input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            min={0}
            step="0.01"
            defaultValue={product?.sellingPrice ?? ""}
            placeholder="19.99"
            aria-invalid={Boolean(fieldErrors?.sellingPrice)}
          />
        </Field>
      </div>

      <Field
        label="Low stock threshold"
        htmlFor="lowStockThreshold"
        hint="Leave blank to use the organization default."
        error={fieldErrors?.lowStockThreshold?.[0]}
      >
        <Input
          id="lowStockThreshold"
          name="lowStockThreshold"
          type="number"
          min={0}
          step={1}
          defaultValue={product?.lowStockThreshold ?? ""}
          placeholder="5"
          aria-invalid={Boolean(fieldErrors?.lowStockThreshold)}
        />
      </Field>

      <Field
        label="Description"
        htmlFor="description"
        hint="Optional."
        error={fieldErrors?.description?.[0]}
      >
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          placeholder="Short notes about this product."
          aria-invalid={Boolean(fieldErrors?.description)}
        />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving..."
            : mode === "create"
              ? "Create product"
              : "Save changes"}
        </Button>
        <Link
          href="/products"
          className={buttonVariants({ variant: "secondary" })}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
