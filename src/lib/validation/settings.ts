import { z } from "zod";

export const settingsSchema = z.object({
  defaultLowStockThreshold: z.coerce
    .number()
    .int("Threshold must be a whole number.")
    .min(0, "Threshold cannot be negative.")
    .max(1_000_000, "Threshold is too large."),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
