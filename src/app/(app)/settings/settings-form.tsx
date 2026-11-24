"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FormError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  updateSettingsAction,
  type SettingsFormState,
} from "@/app/(app)/settings/actions";

type SettingsFormProps = {
  defaultLowStockThreshold: number;
};

const initialState: SettingsFormState = null;

export function SettingsForm({
  defaultLowStockThreshold,
}: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(
    updateSettingsAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <FormError message={state?.error} />

      <Field
        label="Default low stock threshold"
        htmlFor="defaultLowStockThreshold"
        hint="Used for products that do not set their own threshold."
        error={state?.fieldErrors?.defaultLowStockThreshold?.[0]}
      >
        <Input
          id="defaultLowStockThreshold"
          name="defaultLowStockThreshold"
          type="number"
          min={0}
          step={1}
          defaultValue={defaultLowStockThreshold}
          className="max-w-40"
          aria-invalid={Boolean(
            state?.fieldErrors?.defaultLowStockThreshold,
          )}
          required
        />
      </Field>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save settings"}
        </Button>
        {state?.success ? (
          <p role="status" className="text-sm font-medium text-emerald-400">
            Settings saved.
          </p>
        ) : null}
      </div>
    </form>
  );
}
