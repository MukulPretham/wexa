"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createUserSession, hashPassword } from "@/lib/auth";
import { signupSchema } from "@/lib/validation/auth";

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
} | null;

export async function signupAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    organizationName: formData.get("organizationName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { organizationName, email, password } = parsed.data;

  // Friendly pre-check; the unique index still protects against races.
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return {
      fieldErrors: {
        email: ["An account with this email already exists."],
      },
    };
  }

  const passwordHash = await hashPassword(password);

  let userId: string;

  try {
    userId = await prisma.$transaction(async (transaction) => {
      const organization = await transaction.organization.create({
        data: { name: organizationName },
      });

      const user = await transaction.user.create({
        data: {
          organizationId: organization.id,
          email,
          passwordHash,
        },
        select: { id: true },
      });

      return user.id;
    });
  } catch {
    return {
      error: "We could not create your account. Please try again.",
    };
  }

  await createUserSession(userId);
  redirect("/dashboard");
}
