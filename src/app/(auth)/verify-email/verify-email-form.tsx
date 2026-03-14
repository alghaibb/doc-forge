"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { verifyEmailSchema } from "@/lib/schemas/auth";
import { LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => {
      setResendCooldown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  function handleSubmit(formData: FormData) {
    setErrors({});
    setGlobalError("");

    const raw = { otp: formData.get("otp") as string };

    const result = verifyEmailSchema.safeParse(raw);
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
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: result.data.otp,
      });

      if (error) {
        console.error("Verify email error:", error);
        setGlobalError(
          error.message ?? "Invalid or expired code. Please try again."
        );
        return;
      }

      router.push("/");
    });
  }

  async function handleResend() {
    if (!email || resending || resendCooldown > 0) return;

    setResending(true);
    setResent(false);
    setGlobalError("");

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });
    setResending(false);

    if (error) {
      console.error("Resend OTP error:", error);
      setGlobalError(
        error.message ?? "Could not resend code. Please try again."
      );
      return;
    }

    setResent(true);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="text-muted-foreground text-sm">
          We sent a verification code to{" "}
          {email ? (
            <span className="text-foreground font-medium">{email}</span>
          ) : (
            "your email"
          )}
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {globalError && (
          <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-3 text-sm">
            {globalError}
          </div>
        )}

        {resent && (
          <div className="bg-primary/10 text-primary rounded-lg px-4 py-3 text-sm">
            A new code has been sent to your email.
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
            <FieldDescription>
              Enter the 6-digit code from your email
            </FieldDescription>
            {errors.otp && <FieldError>{errors.otp}</FieldError>}
          </FieldContent>
        </Field>

        <LoadingButton type="submit" className="w-full" size="lg" loading={isPending} loadingText="Verifying...">
          Verify email
        </LoadingButton>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || resendCooldown > 0}
          className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resending
            ? "Resending..."
            : resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Resend code"}
        </button>
      </p>
    </div>
  );
}
