import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null || value === undefined ? undefined : value;

const optionalMoney = z.preprocess(
  emptyToUndefined,
  z.coerce
    .number()
    .min(0, "Price cannot be negative.")
    .max(9_999_999_999.99, "Price is too large.")
    .optional(),
);

const optionalThreshold = z.preprocess(
  emptyToUndefined,
  z.coerce
    .number()
    .int("Threshold must be a whole number.")
    .min(0, "Threshold cannot be negative.")
    .max(1_000_000, "Threshold is too large.")
    .optional(),
);

const requiredQuantity = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined ? 0 : value,
  z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(0, "Quantity cannot be negative.")
    .max(1_000_000, "Quantity is too large."),
);

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name must be 120 characters or fewer."),
  sku: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, "SKU is required.")
    .max(64, "SKU must be 64 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer.")
    .optional(),
  quantityOnHand: requiredQuantity,
  costPrice: optionalMoney,
  sellingPrice: optionalMoney,
  lowStockThreshold: optionalThreshold,
});

export type ProductInput = z.infer<typeof productSchema>;

export const stockAdjustmentSchema = z.object({
  delta: z.coerce
    .number()
    .int("Adjustment must be a whole number.")
    .refine((value) => value !== 0, "Enter a non-zero adjustment."),
  note: z
    .string()
    .trim()
    .max(200, "Note must be 200 characters or fewer.")
    .optional(),
});

export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
