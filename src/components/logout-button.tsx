"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingButton } from "./ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const { error } = await authClient.signOut();
    if (error) {
      console.error("Logout error:", error);
      setLoading(false);
      return;
    }
    router.push("/login");
    setLoading(false);
  }

  return (
    <LoadingButton
      loading={loading}
      onClick={handleLogout}
      loadingText="Logging out..."
    >
      Logout
    </LoadingButton>
  );
}
