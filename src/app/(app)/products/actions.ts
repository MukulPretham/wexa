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

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    description: formData.get("description"),
    quantityOnHand: formData.get("quantityOnHand"),
    costPrice: formData.get("costPrice"),
    sellingPrice: formData.get("sellingPrice"),
    lowStockThreshold: formData.get("lowStockThreshold"),
  });
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await requireSession();
  const parsed = parseProductForm(formData);

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

export async function updateProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await requireSession();
  const productId = formData.get("id");

  if (typeof productId !== "string" || productId.length === 0) {
    return { error: "Product not found." };
  }

  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { description, ...values } = parsed.data;

  try {
    const result = await prisma.product.updateMany({
      where: {
        id: productId,
        organizationId: session.organization.id,
      },
      data: {
        ...values,
        description: description ? description : null,
      },
    });

    if (result.count === 0) {
      return { error: "Product not found." };
    }
  } catch (error) {
    if (hasPrismaCode(error, "P2002")) {
      return {
        fieldErrors: {
          sku: ["A product with this SKU already exists in your organization."],
        },
      };
    }

    return { error: "Could not update the product. Please try again." };
  }

  revalidatePath("/products");
  revalidatePath(`/products/${productId}/edit`);
  redirect("/products");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const session = await requireSession();
  const productId = formData.get("id");

  if (typeof productId === "string" && productId.length > 0) {
    await prisma.product.deleteMany({
      where: {
        id: productId,
        organizationId: session.organization.id,
      },
    });
  }

  revalidatePath("/products");
  redirect("/products");
}
