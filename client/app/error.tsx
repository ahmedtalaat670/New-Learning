"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-1 items-center justify-center bg-linear-to-br from-white via-gray-50 to-orange-50/40 px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="relative mx-auto mb-8 flex size-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-orange-100/70" />

          <div className="relative flex size-16 items-center justify-center rounded-2xl border border-orange-200 bg-white shadow-sm">
            <AlertTriangle className="size-8 text-primary" strokeWidth={1.7} />
          </div>
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Something went wrong
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          We hit a little snag.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-gray-500">
          An unexpected error occurred while loading this page. Please try
          again, or return to the homepage.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e88700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Home className="size-4" />
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
