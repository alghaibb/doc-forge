import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter your reset code and choose a new password for your Doc Forge account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
