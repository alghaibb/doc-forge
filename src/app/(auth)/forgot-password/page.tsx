import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset code for your Doc Forge account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
