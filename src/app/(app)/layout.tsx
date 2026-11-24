import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth";

export const instant = false;

export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireSession();

  return <div className="flex min-h-screen flex-1 flex-col">{children}</div>;
}
