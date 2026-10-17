"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/_stores/auth";

export function AuthInitializer() {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setInitializing = useAuthStore((state) => state.setInitializing);

  useEffect(() => {
    let isMounted = true;

    async function refreshAccessToken() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (!response.ok) {
          if (isMounted) clearAuth();
          return;
        }

        const data = await response.json();

        if (!data.user) {
          if (isMounted) clearAuth();
          return;
        }

        if (isMounted) {
          if (data.accessToken) {
            useAuthStore.getState().setAuth(data.accessToken, data.user);
          } else {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Authentication initialization failed:", error);
        if (isMounted) clearAuth();
      } finally {
        if (isMounted) setInitializing(false);
      }
    }

    refreshAccessToken();

    return () => {
      isMounted = false;
    };
  }, [clearAuth, setUser, setInitializing]);

  useEffect(() => {
    if (isInitializing) return;

    const isInstructorRoute = pathname.startsWith("/instructor");
    const isAuthRoute =
      pathname.startsWith("/login") || pathname.startsWith("/signup");

    if (!isAuthenticated) {
      if (isInstructorRoute) {
        router.replace("/login");
      }
      return;
    }

    if (user) {
      const userRole = user.role?.toLowerCase();

      if (isInstructorRoute && userRole !== "instructor") {
        router.replace("/");
      }
      if (userRole === "instructor" && !isInstructorRoute) {
        router.replace("/instructor/courses");
      }
      if (isAuthRoute) {
        if (userRole === "instructor") {
          router.replace("/instructor/courses");
        } else {
          router.replace("/");
        }
      }
    }
  }, [isInitializing, isAuthenticated, user, pathname, router]);

  return null;
}
