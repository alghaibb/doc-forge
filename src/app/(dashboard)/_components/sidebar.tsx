"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  FolderOpen,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "./sidebar-context";
import { SidebarUser } from "./sidebar-user";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
  { label: "Folders", href: "/folders", icon: FolderOpen, disabled: true },
  { label: "Settings", href: "/settings", icon: Settings, disabled: true },
];

interface SidebarProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border/50 bg-background transition-[width] duration-300 ease-in-out",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-border/50 px-4",
          collapsed && "justify-center px-0"
        )}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-foreground"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            D
          </div>
          {!collapsed && <span className="text-sm tracking-tight">Doc Forge</span>}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          const link = (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              aria-disabled={item.disabled}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.disabled && "pointer-events-none opacity-40",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return link;
        })}
      </nav>

      <div className="mt-auto border-t border-border/50">
        <SidebarUser user={user} collapsed={collapsed} />

        <button
          onClick={toggle}
          className="flex w-full items-center justify-center border-t border-border/50 py-3 text-muted-foreground transition-colors hover:text-foreground"
        >
          {collapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <div className="flex w-full items-center gap-2 px-4 text-xs">
              <ChevronsLeft className="size-4" />
              <span>Collapse</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
