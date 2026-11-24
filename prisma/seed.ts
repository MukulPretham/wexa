import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const DEMO_ORGANIZATION_ID = "org_demo_store";
const DEMO_EMAIL = "demo@stockflow.dev";
const DEMO_PASSWORD = "password123";

const demoProducts = [
  {
    name: "Wireless Mouse",
    sku: "WM-001",
    description: "2.4 GHz wireless mouse with USB receiver.",
    quantityOnHand: 42,
    costPrice: 8.5,
    sellingPrice: 19.99,
    lowStockThreshold: 10,
  },
  {
    name: "Mechanical Keyboard",
    sku: "MK-002",
    description: "Tenkeyless keyboard with brown switches.",
    quantityOnHand: 18,
    costPrice: 35,
    sellingPrice: 79.99,
    lowStockThreshold: 5,
  },
  {
    name: "USB-C Hub",
    sku: "UC-003",
    description: "7-in-1 hub with HDMI, USB 3.0 and card reader.",
    quantityOnHand: 4,
    costPrice: 22,
    sellingPrice: 49.99,
    lowStockThreshold: 8,
  },
  {
    name: '27" Monitor',
    sku: "MN-004",
    description: "1440p IPS display with height-adjustable stand.",
    quantityOnHand: 7,
    costPrice: 140,
    sellingPrice: 249.99,
    lowStockThreshold: null,
  },
  {
    name: "Laptop Stand",
    sku: "LS-005",
    description: "Aluminium stand for 11-17 inch laptops.",
    quantityOnHand: 3,
    costPrice: 12,
    sellingPrice: 34.99,
    lowStockThreshold: 5,
  },
  {
    name: "Webcam 1080p",
    sku: "WC-006",
    description: "Full HD webcam with dual microphones.",
    quantityOnHand: 0,
    costPrice: 25,
    sellingPrice: 59.99,
    lowStockThreshold: 2,
  },
  {
    name: "Noise-Cancelling Headphones",
    sku: "NC-007",
    description: "Over-ear Bluetooth headphones with ANC.",
    quantityOnHand: 12,
    costPrice: 60,
    sellingPrice: 129.99,
    lowStockThreshold: null,
  },
  {
    name: "Desk Mat",
    sku: "DM-008",
    description: "900 x 400 mm stitched-edge desk mat.",
    quantityOnHand: 25,
    costPrice: 6,
    sellingPrice: 24.99,
    lowStockThreshold: 10,
  },
  {
    name: "HDMI Cable 2m",
    sku: "HC-009",
    description: "High-speed HDMI 2.1 cable.",
    quantityOnHand: 2,
    costPrice: 2.5,
    sellingPrice: 9.99,
    lowStockThreshold: 5,
  },
];

async function main() {
  const passwordHash = await hash(DEMO_PASSWORD, 10);

  const organization = await prisma.organization.upsert({
    where: { id: DEMO_ORGANIZATION_ID },
    update: {
      name: "Demo Store",
      defaultLowStockThreshold: 5,
    },
    create: {
      id: DEMO_ORGANIZATION_ID,
      name: "Demo Store",
      defaultLowStockThreshold: 5,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      organizationId: organization.id,
      passwordHash,
    },
    create: {
      email: DEMO_EMAIL,
      organizationId: organization.id,
      passwordHash,
    },
  });

  for (const product of demoProducts) {
    await prisma.product.upsert({
      where: {
        organizationId_sku: {
          organizationId: organization.id,
          sku: product.sku,
        },
      },
      update: product,
      create: {
        ...product,
        organizationId: organization.id,
      },
    });
  }

  console.log(
    `Seeded ${demoProducts.length} products for "${organization.name}" — login: ${user.email} / ${DEMO_PASSWORD}`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
