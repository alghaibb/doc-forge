import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import {
  DocumentStatus,
  DocumentType,
} from "@/generated/prisma/enums";
import { DashboardHeader } from "../_components/dashboard-header";
import { DocumentCard } from "./_components/document-card";
import { DocumentFilters } from "./_components/document-filters";

export const metadata: Metadata = {
  title: "Documents",
};

interface DocumentsPageProps {
  searchParams: Promise<{
    type?: string;
    status?: string;
  }>;
}

function parseType(value: string | undefined): DocumentType | undefined {
  if (value === "TEMPLATE" || value === "UPLOADED") return value;
  return undefined;
}

function parseStatus(value: string | undefined): DocumentStatus | undefined {
  if (value === "DRAFT" || value === "COMPLETED") return value;
  return undefined;
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const typeFilter = parseType(params.type);
  const statusFilter = parseStatus(params.status);

  const documents = await prisma.document.findMany({
    where: {
      userId: session.user.id,
      ...(typeFilter ? { type: typeFilter } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: {
      template: { select: { name: true } },
    },
  });

  const hasFilters = Boolean(typeFilter || statusFilter);

  return (
    <>
      <DashboardHeader title="Documents" />
      <div className="mx-auto w-full max-w-7xl flex-1 p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DocumentFilters />
          <Button asChild size="sm">
            <Link href="/documents/new">
              <Plus className="size-4" />
              New document
            </Link>
          </Button>
        </div>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 px-6 py-16">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              {hasFilters ? "No documents match your filters" : "No documents yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasFilters
                ? "Try adjusting the filters above."
                : "Create your first document from a template to get started."}
            </p>
            {!hasFilters && (
              <Button asChild size="sm" className="mt-4">
                <Link href="/documents/new">
                  <Plus className="size-4" />
                  New document
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                title={doc.title}
                type={doc.type}
                status={doc.status}
                templateName={doc.template?.name ?? null}
                updatedAt={doc.updatedAt}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
