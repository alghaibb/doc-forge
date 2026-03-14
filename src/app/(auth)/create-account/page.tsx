import type { Metadata } from "next";
import { CreateAccountForm } from "./create-account-form";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a Doc Forge account to start editing and managing your PDF documents.",
};

export default function CreateAccountPage() {
  return <CreateAccountForm />;
}
