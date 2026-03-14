"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema } from "@/lib/schemas/auth";
import { LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  function handleSubmit(formData: FormData) {
    setErrors({});
    setGlobalError("");

    const raw = { email: formData.get("email") as string };

    const result = forgotPasswordSchema.safeParse(raw);
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
      const { error } = await authClient.emailOtp.requestPasswordReset({
        email: result.data.email,
      });

      if (error) {
        console.error("Forgot password error:", error);
        setGlobalError(
          error.message ?? "Something went wrong. Please try again."
        );
        return;
      }

      router.push(
        `/reset-password?email=${encodeURIComponent(result.data.email)}`
      );
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot password?
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we&apos;ll send you a code to reset your password
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

        <LoadingButton type="submit" className="w-full" size="lg" loading={isPending} loadingText="Sending code...">
          Send reset code
        </LoadingButton>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
