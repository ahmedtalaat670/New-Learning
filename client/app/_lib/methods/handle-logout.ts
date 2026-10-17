import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function handleLogout(
  clearAuth: () => void,
  router: AppRouterInstance,
) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearAuth();
    router.replace("/");
  }
}
