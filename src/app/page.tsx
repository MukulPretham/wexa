export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600">
          StockFlow
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900">
          Inventory management for small teams
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Keep products, stock levels, and low-stock items in one place.
        </p>
      </div>
    </main>
  );
}
