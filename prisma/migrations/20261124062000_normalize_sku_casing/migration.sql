-- Normalize existing SKUs so per-organization uniqueness is effectively
-- case-insensitive, matching the normalization applied on write.
UPDATE "products" SET "sku" = upper("sku");
