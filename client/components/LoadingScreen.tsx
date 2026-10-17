"use client";

import { GraduationCap } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="flex min-h-[70vh] flex-col items-center justify-center 
        bg-linear-to-br from-white via-gray-50 to-orange-50/40 
        px-6 text-center"
    >
      {/* Animated loader */}
      <div className="relative mb-8 flex size-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[5px] border-gray-200" />

        <div
          className="absolute inset-0 animate-spin rounded-full 
            border-[5px] border-transparent border-t-primary"
          style={{ animationDuration: "1.2s" }}
        />

        <div className="flex size-16 items-center justify-center rounded-full bg-orange-50">
          <GraduationCap className="size-8 text-primary" strokeWidth={1.8} />
        </div>
      </div>

      {/* Loading message */}
      <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
        Preparing your learning space
      </h2>

      {/* Animated dots */}
      <div className="mt-7 flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-2.5 animate-bounce rounded-full bg-primary"
            style={{
              animationDelay: `${dot * 150}ms`,
              animationDuration: "900ms",
            }}
          />
        ))}
      </div>

      <span className="sr-only">Please wait.</span>
    </div>
  );
}
