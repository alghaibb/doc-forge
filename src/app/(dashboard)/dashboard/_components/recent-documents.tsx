import { prisma } from "@/lib/db";
import { FileText, Clock } from "lucide-react";
import Link from "next/link";

interface RecentDocumentsProps {
  userId: string;
}

export async function RecentDocuments({ userId }: RecentDocumentsProps) {
  const documents = await prisma.document.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      updatedAt: true,
    },
  });

  if (documents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
          <FileText className="size-5 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          No documents yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Create a template or upload a PDF to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <Link
          key={doc.id}
          href={`/documents/${doc.id}`}
          className="flex items-center gap-3 rounded-xl border border-border/40 bg-background px-4 py-3 transition-colors hover:bg-muted"
        >
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {doc.title}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded bg-muted px-1.5 py-0.5 capitalize">
                {doc.type.toLowerCase()}
              </span>
              <span className="rounded bg-muted px-1.5 py-0.5 capitalize">
                {doc.status.toLowerCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            <time dateTime={doc.updatedAt.toISOString()}>
              {formatRelativeDate(doc.updatedAt)}
            </time>
          </div>
        </Link>
      ))}
    </div>
  );
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
