import Link from "next/link";
import { FileText, Upload, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DocumentStatus, DocumentType } from "@/generated/prisma/enums";

interface DocumentCardProps {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  templateName: string | null;
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

export function DocumentCard({
  id,
  title,
  type,
  status,
  templateName,
  updatedAt,
}: DocumentCardProps) {
  const Icon = type === "TEMPLATE" ? FileText : Upload;
  const iconColor =
    type === "TEMPLATE" ? "bg-primary/10 text-primary" : "bg-chart-2/10 text-chart-2";

  return (
    <Link
      href={`/documents/${id}`}
      className="group flex flex-col rounded-2xl border border-border/60 bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconColor}`}
        >
          <Icon className="size-5" />
        </div>
        <Badge
          variant={status === "COMPLETED" ? "default" : "secondary"}
          className="shrink-0 text-xs capitalize"
        >
          {status.toLowerCase()}
        </Badge>
      </div>

      <h3 className="mt-3 truncate text-sm font-semibold text-foreground">
        {title}
      </h3>

      {templateName && (
        <p className="mt-1 truncate text-xs text-muted-foreground">
          From {templateName}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3 border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span className="capitalize">{type.toLowerCase()}</span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {formatRelativeDate(updatedAt)}
        </span>
      </div>
    </Link>
  );
}
