"use client";

import { PanelLeft } from "lucide-react";
import { useSidebar } from "./sidebar-context";

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { toggle } = useSidebar();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border/50 px-6">
      <button
        onClick={toggle}
        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="size-[18px]" />
      </button>
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
    </header>
  );
}
