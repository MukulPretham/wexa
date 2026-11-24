export function resolveLowStockThreshold(
  productThreshold: number | null,
  organizationDefault: number,
): number {
  return productThreshold ?? organizationDefault;
}

export function isLowStock(
  quantityOnHand: number,
  productThreshold: number | null,
  organizationDefault: number,
): boolean {
  return (
    quantityOnHand <=
    resolveLowStockThreshold(productThreshold, organizationDefault)
  );
}
