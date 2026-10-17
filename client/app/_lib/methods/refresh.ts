import { useAuthStore } from "@/app/_stores/auth";

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
      },
    )
      .then(async (response) => {
        if (!response.ok) {
          useAuthStore.getState().clearAuth();
          return null;
        }

        const data = await response.json();

        useAuthStore.getState().setAuth(data.accessToken, data.user);

        return data.accessToken;
      })
      .catch(() => {
        useAuthStore.getState().clearAuth();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}
