"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/validation/product";

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
} | null;

function hasPrismaCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === code
  );
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await requireSession();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    description: formData.get("description"),
    quantityOnHand: formData.get("quantityOnHand"),
    costPrice: formData.get("costPrice"),
    sellingPrice: formData.get("sellingPrice"),
    lowStockThreshold: formData.get("lowStockThreshold"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { description, ...values } = parsed.data;

  try {
    await prisma.product.create({
      data: {
        organizationId: session.organization.id,
        ...values,
        description: description ? description : null,
      },
    });
  } catch (error) {
    if (hasPrismaCode(error, "P2002")) {
      return {
        fieldErrors: {
          sku: ["A product with this SKU already exists in your organization."],
        },
      };
    }

    return { error: "Could not create the product. Please try again." };
  }

  revalidatePath("/products");
  redirect("/products");
}
