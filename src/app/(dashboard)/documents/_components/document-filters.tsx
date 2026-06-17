"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "TEMPLATE", label: "From template" },
  { value: "UPLOADED", label: "Uploaded" },
] as const;

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "COMPLETED", label: "Completed" },
] as const;

export function DocumentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") ?? "all";
  const currentStatus = searchParams.get("status") ?? "all";

  function setParam(key: "type" | "status", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.push(qs ? `/documents?${qs}` : "/documents");
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterGroup
        label="Type"
        options={TYPE_OPTIONS}
        current={currentType}
        onChange={(v) => setParam("type", v)}
      />
      <div className="hidden h-5 w-px bg-border/60 sm:block" />
      <FilterGroup
        label="Status"
        options={STATUS_OPTIONS}
        current={currentStatus}
        onChange={(v) => setParam("status", v)}
      />
    </div>
  );
}

interface FilterGroupProps {
  label: string;
  options: readonly { value: string; label: string }[];
  current: string;
  onChange: (value: string) => void;
}

function FilterGroup({ label, options, current, onChange }: FilterGroupProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 p-1">
        {options.map((opt) => {
          const active = current === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
