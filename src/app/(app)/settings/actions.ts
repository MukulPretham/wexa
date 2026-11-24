"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { settingsSchema } from "@/lib/validation/settings";

export type SettingsFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  success?: boolean;
} | null;

export async function updateSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await requireSession();

  const parsed = settingsSchema.safeParse({
    defaultLowStockThreshold: formData.get("defaultLowStockThreshold"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await prisma.organization.update({
      where: { id: session.organization.id },
      data: {
        defaultLowStockThreshold: parsed.data.defaultLowStockThreshold,
      },
    });
  } catch {
    return { error: "Could not save settings. Please try again." };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/products");

  return { success: true };
}
