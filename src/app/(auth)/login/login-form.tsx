"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/lib/schemas/auth";
import { LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  function handleSubmit(formData: FormData) {
    setErrors({});
    setGlobalError("");

    const raw = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = loginSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const { error } = await authClient.signIn.email({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        console.error("Login error:", error);
        setGlobalError(error.message ?? "Invalid email or password");
        return;
      }

      router.push("/dashboard");
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Enter your credentials to sign in to your account
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {globalError && (
          <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-3 text-sm">
            {globalError}
          </div>
        )}

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.password}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="text-primary text-sm hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <FieldContent>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
            />
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </FieldContent>
        </Field>

        <LoadingButton type="submit" className="w-full" size="lg" loading={isPending} loadingText="Signing in...">
          Sign in
        </LoadingButton>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/create-account" className="text-primary hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
