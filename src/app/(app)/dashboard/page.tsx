import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
        <span className="text-sm font-semibold tracking-tight text-zinc-900">
          StockFlow
        </span>
        <form action={logoutAction}>
          <Button type="submit" variant="secondary" size="sm">
            Log out
          </Button>
        </form>
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Your organization is ready. Product management and inventory
            metrics are on the way.
          </p>
        </div>
      </main>
    </div>
  );
}
