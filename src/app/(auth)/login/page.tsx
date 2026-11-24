import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — StockFlow",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
        Welcome back
      </h1>
      <p className="mt-2 text-sm leading-6 text-zinc-400">
        Sign in to manage your inventory.
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>

      <p className="mt-6 text-sm text-zinc-400">
        New to StockFlow?{" "}
        <Link
          href="/signup"
          className="font-medium text-zinc-100 underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
