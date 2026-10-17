"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/app/_stores/auth";
import { signInSchema, SignInValues } from "@/app/_lib/schemas/sign-in.schema";
import { signInFormInputs } from "@/app/_lib/constants/signin-form-inputs";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { FormInput } from "@/components/FormInput";

export default function LogInForm() {
  const setUser = useAuthStore((state) => state.setUser);

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInValues) {
    setServerError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      console.log(response, "sign in form response");

      if (!response.ok) {
        const message = Array.isArray(data.error?.message)
          ? data.error.message.join(" ")
          : (data.error?.message ?? "Invalid email or password.");

        setServerError(message);
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error("Sign in error:", error);

      setServerError("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-5">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Sign in to continue learning with SkillBridge.
          </p>
        </div>

        <GoogleLoginButton />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs uppercase tracking-wide text-slate-500">
            or sign in with email
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-2"
        >
          <div className="flex flex-col gap-5">
            {signInFormInputs.map((field) => (
              <FormInput
                key={field.name}
                id={field.name}
                label={field.label}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                registration={register(field.name)}
                error={errors[field.name]}
                hint={field.hint}
              />
            ))}
          </div>

          {serverError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
