import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LayoutTemplate, Plus, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "../../_components/dashboard-header";

export const metadata: Metadata = {
  title: "New Document",
};

export default async function NewDocumentPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const templates = await prisma.template.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { fields: true } } },
  });

  return (
    <>
      <DashboardHeader title="New Document" />
      <div className="mx-auto w-full max-w-5xl flex-1 p-6">
        <Link
          href="/documents"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to documents
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Pick a template
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a template to create your document from.
          </p>
        </div>

        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 px-6 py-16">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
              <LayoutTemplate className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              No templates yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a template first to start generating documents.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/templates/new">
                <Plus className="size-4" />
                Create template
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <Link
                key={t.id}
                href={`/documents/new/${t.id}`}
                className="group flex flex-col rounded-2xl border border-border/60 bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>
                <h3 className="mt-3 truncate text-sm font-semibold text-foreground">
                  {t.name}
                </h3>
                {t.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {t.description}
                  </p>
                )}
                <div className="mt-auto pt-3 text-xs text-muted-foreground">
                  {t._count.fields}{" "}
                  {t._count.fields === 1 ? "field" : "fields"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
