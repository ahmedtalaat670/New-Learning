"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/app/_stores/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { handleLogout } from "@/app/_lib/methods/handle-logout";

export function AuthActions() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isInitializing = useAuthStore((state) => state.isInitializing);

  const clearAuth = useAuthStore((state) => state.clearAuth);

  if (isInitializing) {
    return (
      <div className="flex flex-col lg:flex-row items-center gap-3">
        <Skeleton className="h-9 w-full lg:w-25 rounded-lg bg-gray-200" />
        <Skeleton className="h-9 w-full lg:w-25 rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-col lg:flex-row items-center gap-3">
        <Link
          href="/student/courses"
          className="rounded-lg text-center w-full lg:w-35 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          My Courses
        </Link>

        <button
          type="button"
          onClick={() => handleLogout(clearAuth, router)}
          className="rounded-lg text-center bg-orange-500 w-full lg:w-25 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-3">
      <Link
        href="/login"
        className="rounded-lg text-center w-full lg:w-25 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Login
      </Link>

      <Link
        href="/signup"
        className="rounded-lg text-center w-full lg:w-25 bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
      >
        Sign Up
      </Link>
    </div>
  );
}
