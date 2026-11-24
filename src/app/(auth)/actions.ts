"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  createUserSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema, signupSchema } from "@/lib/validation/auth";

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
} | null;

// Compared against when the email does not exist, so a failed login takes a
// similar amount of time whether or not the account is registered.
const DUMMY_PASSWORD_HASH =
  "$2b$10$LDQsA9salne.iIAeRH5D1.AHlUcAWvyq1Tjne0l3.WS/OrnN7YyYi";

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

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    await verifyPassword(password, DUMMY_PASSWORD_HASH);
    return { error: "Invalid email or password." };
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    return { error: "Invalid email or password." };
  }

  await createUserSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
