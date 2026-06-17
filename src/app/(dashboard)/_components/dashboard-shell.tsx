"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        "flex min-h-svh flex-col transition-[margin-left] duration-300 ease-in-out",
        collapsed ? "ml-16" : "ml-60"
      )}
    >
      {children}
    </div>
  );
}
