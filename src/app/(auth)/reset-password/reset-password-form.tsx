"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema } from "@/lib/schemas/auth";
import { LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  function handleSubmit(formData: FormData) {
    setErrors({});
    setGlobalError("");

    const raw = {
      otp: formData.get("otp") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const result = resetPasswordSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    if (!email) {
      setGlobalError("Email is missing. Please go back and try again.");
      return;
    }

    startTransition(async () => {
      const { error } = await authClient.emailOtp.resetPassword({
        email,
        otp: result.data.otp,
        password: result.data.password,
      });

      if (error) {
        console.error("Reset password error:", error);
        setGlobalError(
          error.message ?? "Invalid or expired code. Please try again."
        );
        return;
      }

      router.push("/login");
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter the 6-digit code sent to{" "}
          {email ? (
            <span className="text-foreground font-medium">{email}</span>
          ) : (
            "your email"
          )}{" "}
          and choose a new password
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {globalError && (
          <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-3 text-sm">
            {globalError}
          </div>
        )}

        <Field data-invalid={!!errors.otp}>
          <FieldLabel htmlFor="otp">Verification code</FieldLabel>
          <FieldContent>
            <Input
              id="otp"
              name="otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              autoComplete="one-time-code"
              className="text-center text-lg tracking-[0.3em]"
              aria-invalid={!!errors.otp}
            />
            <FieldDescription>Check your email for the 6-digit code</FieldDescription>
            {errors.otp && <FieldError>{errors.otp}</FieldError>}
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <FieldContent>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
            />
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
          <FieldContent>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword}</FieldError>
            )}
          </FieldContent>
        </Field>

        <LoadingButton type="submit" className="w-full" size="lg" loading={isPending} loadingText="Resetting password...">
          Reset password
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
