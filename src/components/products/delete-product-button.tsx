"use client";

import { useRef } from "react";
import { deleteProductAction } from "@/app/(app)/products/actions";
import { Button } from "@/components/ui/button";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="text-sm font-medium text-red-600 hover:text-red-700"
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-0 shadow-xl backdrop:bg-zinc-900/40"
        aria-labelledby={`delete-title-${productId}`}
      >
        <div className="p-6">
          <h2
            id={`delete-title-${productId}`}
            className="text-base font-semibold text-zinc-900"
          >
            Delete product?
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            “{productName}” will be permanently removed. This cannot be undone.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </Button>
            <form action={deleteProductAction}>
              <input type="hidden" name="id" value={productId} />
              <Button type="submit" variant="danger">
                Delete product
              </Button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
