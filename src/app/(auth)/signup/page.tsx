import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create account — StockFlow",
};

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
        Create your organization
      </h1>
      <p className="mt-2 text-sm leading-6 text-zinc-400">
        Set up a workspace for your products and inventory.
      </p>

      <div className="mt-8">
        <SignupForm />
      </div>

      <p className="mt-6 text-sm text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-zinc-100 underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
