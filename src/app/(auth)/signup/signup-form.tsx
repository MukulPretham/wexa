"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupAction, type AuthFormState } from "../actions";

const initialState: AuthFormState = null;

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signupAction,
    initialState,
  );

  const fieldErrors = state?.fieldErrors;

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FormError message={state?.error} />

      <Field
        label="Organization name"
        htmlFor="organizationName"
        error={fieldErrors?.organizationName?.[0]}
        hint="The workspace your products will belong to."
      >
        <Input
          id="organizationName"
          name="organizationName"
          autoComplete="organization"
          placeholder="My Test Store"
          aria-invalid={Boolean(fieldErrors?.organizationName)}
          required
        />
      </Field>

      <Field
        label="Email"
        htmlFor="email"
        error={fieldErrors?.email?.[0]}
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(fieldErrors?.email)}
          required
        />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        error={fieldErrors?.password?.[0]}
        hint="At least 8 characters."
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(fieldErrors?.password)}
          required
        />
      </Field>

      <Field
        label="Confirm password"
        htmlFor="confirmPassword"
        error={fieldErrors?.confirmPassword?.[0]}
      >
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(fieldErrors?.confirmPassword)}
          required
        />
      </Field>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
