import Link from "next/link";
import { FileText, Lock, Globe, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TemplateCardProps {
  id: string;
  name: string;
  description: string | null;
  visibility: "PRIVATE" | "PUBLIC";
  fieldCount: number;
  updatedAt: Date;
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TemplateCard({
  id,
  name,
  description,
  visibility,
  fieldCount,
  updatedAt,
}: TemplateCardProps) {
  return (
    <Link
      href={`/templates/${id}`}
      className="group flex flex-col rounded-2xl border border-border/60 bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="size-5" />
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {visibility === "PRIVATE" ? (
            <>
              <Lock className="size-3" />
              Private
            </>
          ) : (
            <>
              <Globe className="size-3" />
              Public
            </>
          )}
        </Badge>
      </div>

      <h3 className="mt-3 truncate text-sm font-semibold text-foreground">
        {name}
      </h3>

      {description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {description}
        </p>
      )}

      <div className="mt-auto flex items-center gap-3 border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>{fieldCount} {fieldCount === 1 ? "field" : "fields"}</span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {formatRelativeDate(updatedAt)}
        </span>
      </div>
    </Link>
  );
}
