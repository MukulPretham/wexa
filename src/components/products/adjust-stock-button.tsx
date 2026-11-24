"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import {
  adjustStockAction,
  type StockAdjustmentState,
} from "@/app/(app)/products/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AdjustStockButtonProps = {
  productId: string;
  productName: string;
  quantityOnHand: number;
};

const initialState: StockAdjustmentState = null;

export function AdjustStockButton({
  productId,
  productName,
  quantityOnHand,
}: AdjustStockButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    adjustStockAction,
    initialState,
  );

  useEffect(() => {
    if (state?.success) {
      dialogRef.current?.close();
      router.refresh();
    }
  }, [state, router]);

  function openDialog() {
    formRef.current?.reset();
    dialogRef.current?.showModal();
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="text-sm font-medium text-zinc-400 hover:text-zinc-100"
      >
        Adjust
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-900 p-0 text-left text-zinc-100 shadow-2xl backdrop:bg-black/70"
        aria-labelledby={`adjust-title-${productId}`}
      >
        <form ref={formRef} action={formAction} className="p-6">
          <h2
            id={`adjust-title-${productId}`}
            className="text-base font-semibold text-zinc-50"
          >
            Adjust stock
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {productName} currently has {quantityOnHand} unit
            {quantityOnHand === 1 ? "" : "s"} on hand.
          </p>

          <input type="hidden" name="id" value={productId} />

          <div className="mt-4 space-y-4">
            <Field
              label="Adjustment"
              htmlFor={`delta-${productId}`}
              hint="Positive to add stock, negative to remove it."
              error={state?.error}
            >
              <Input
                id={`delta-${productId}`}
                name="delta"
                type="number"
                step={1}
                placeholder="5 or -2"
                required
              />
            </Field>

            <Field
              label="Note"
              htmlFor={`note-${productId}`}
              hint="Optional."
            >
              <Input
                id={`note-${productId}`}
                name="note"
                maxLength={200}
                placeholder="Cycle count correction"
              />
            </Field>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Applying..." : "Apply adjustment"}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
