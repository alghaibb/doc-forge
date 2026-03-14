import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Doc Forge account to manage your PDF documents.",
};

export default function LoginPage() {
  return <LoginForm />;
}
