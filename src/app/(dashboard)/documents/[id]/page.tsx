import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, FileText, Upload, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { TiptapPreview } from "@/components/ui/tiptap-preview";
import { mergeTiptapContent } from "@/lib/merge-fields";
import { DashboardHeader } from "../../_components/dashboard-header";
import { DeleteDocumentDialog } from "./_components/delete-document-dialog";
import { StatusToggle } from "./_components/status-toggle";

export const metadata: Metadata = {
  title: "Document",
};

interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function DocumentViewPage({ params }: DocumentPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      template: {
        include: { fields: { orderBy: { order: "asc" } } },
      },
      fieldValues: true,
    },
  });

  if (!document || document.userId !== session.user.id) {
    notFound();
  }

  const fieldValueMap = new Map(
    document.fieldValues.map((fv) => [fv.fieldId, fv.value])
  );

  const mergedContent = document.template
    ? mergeTiptapContent(
        document.template.content,
        document.template.fields.map((f) => ({
          label: f.label,
          type: f.type,
          renderAs: f.renderAs,
          value: fieldValueMap.get(f.id) ?? "",
        }))
      )
    : "";

  const TypeIcon = document.type === "TEMPLATE" ? FileText : Upload;

  return (
    <>
      <DashboardHeader title={document.title} />
      <div className="mx-auto w-full max-w-5xl flex-1 p-6">
        <Link
          href="/documents"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to documents
        </Link>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs capitalize">
                <TypeIcon className="size-3" />
                {document.type.toLowerCase()}
              </Badge>
              <Badge
                variant={document.status === "COMPLETED" ? "default" : "secondary"}
                className="text-xs capitalize"
              >
                {document.status.toLowerCase()}
              </Badge>
              {document.template && (
                <Badge variant="outline" className="text-xs">
                  From {document.template.name}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {document.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                Created {formatDate(document.createdAt)}
              </span>
              <span>•</span>
              <span>Updated {formatDate(document.updatedAt)}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <StatusToggle
              documentId={document.id}
              status={document.status}
            />
            <DeleteDocumentDialog
              documentId={document.id}
              documentTitle={document.title}
            />
          </div>
        </div>

        {document.template && (
          <section className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Document
            </h2>
            <TiptapPreview content={mergedContent} />
          </section>
        )}

        {document.template && document.template.fields.length > 0 && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Field values
            </h2>
            <dl className="divide-y divide-border/40 rounded-2xl border border-border/60 bg-background">
              {document.template.fields.map((f) => {
                const rawValue = fieldValueMap.get(f.id) ?? "";
                const display =
                  f.type === "CHECKBOX"
                    ? rawValue === "true"
                      ? "Yes"
                      : "No"
                    : rawValue || (
                        <span className="italic text-muted-foreground/60">
                          empty
                        </span>
                      );

                return (
                  <div
                    key={f.id}
                    className="flex items-start justify-between gap-6 px-5 py-4"
                  >
                    <dt className="text-sm font-medium text-muted-foreground">
                      {f.label}
                    </dt>
                    <dd className="max-w-xl text-right text-sm text-foreground">
                      {display}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        )}
      </div>
    </>
  );
}
