"use client";

import { useAuthStore } from "@/app/_stores/auth";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function GoogleLoginButton() {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSuccess = async (credential: string) => {
    try {
      setError(null);
      setIsLoading(true);
      if (!API_URL) {
        throw new Error("API URL is not configured");
      }

      const response = await fetch(`${API_URL}/google-authentication`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: credential,
        }),
      });

      const data = await response.json();
      console.log(data.error);
      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Google authentication failed");
      }

      setUser(data.user);

      router.replace("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`space-y-2 ${isLoading ? "pointer-events-none opacity-50" : ""}`}
    >
      <GoogleLogin
        onSuccess={(response) => {
          if (!response.credential) {
            setError("Google authentication failed.");
            return;
          }
          void handleSuccess(response.credential);
        }}
        onError={() => {
          setError("Google authentication failed. Please try again.");
        }}
        text="continue_with"
        theme="outline"
        size="large"
        shape="rectangular"
        width="100%"
      />

      {error && (
        <p role="alert" className="text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
