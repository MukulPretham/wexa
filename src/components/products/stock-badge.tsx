import { isLowStock } from "@/lib/low-stock";
import { cn } from "@/lib/cn";

type StockBadgeProps = {
  quantityOnHand: number;
  lowStockThreshold: number | null;
  organizationDefault: number;
};

export function StockBadge({
  quantityOnHand,
  lowStockThreshold,
  organizationDefault,
}: StockBadgeProps) {
  if (quantityOnHand === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
        Out of stock
      </span>
    );
  }

  if (isLowStock(quantityOnHand, lowStockThreshold, organizationDefault)) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
        Low stock
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600",
      )}
    >
      In stock
    </span>
  );
}
