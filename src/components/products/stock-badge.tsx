import { isLowStock } from "@/lib/low-stock";

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
      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
        Out of stock
      </span>
    );
  }

  if (isLowStock(quantityOnHand, lowStockThreshold, organizationDefault)) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
        Low stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">
      In stock
    </span>
  );
}
