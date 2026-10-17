"use client";

import { useAuthStore } from "@/app/_stores/auth";
import LoadingScreen from "./LoadingScreen";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const isInitializing = useAuthStore((state) => state.isInitializing);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return children;
}
