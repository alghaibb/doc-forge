import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Lock, Globe, Pencil, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "../../_components/dashboard-header";
import { DeleteTemplateDialog } from "../_components/delete-template-dialog";
import { TiptapEditor } from "@/components/ui/tiptap-editor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const template = await prisma.template.findUnique({
    where: { id },
    select: { name: true },
  });
  return { title: template?.name ?? "Template" };
}

const FIELD_TYPE_LABELS: Record<string, string> = {
  TEXT: "Text",
  NUMBER: "Number",
  DATE: "Date",
  SELECT: "Select",
  CHECKBOX: "Checkbox",
  TEXTAREA: "Textarea",
};

export default async function TemplateViewPage({ params }: PageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const template = await prisma.template.findUnique({
    where: { id },
    include: {
      fields: { orderBy: { order: "asc" } },
    },
  });

  if (!template || template.userId !== session.user.id) {
    notFound();
  }

  return (
    <>
      <DashboardHeader title={template.name} />
      <div className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">
                {template.name}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {template.visibility === "PRIVATE" ? (
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
            {template.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {template.description}
              </p>
            )}
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              Updated{" "}
              {template.updatedAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/templates/${template.id}/edit`}>
                <Pencil className="size-4" />
                Edit
              </Link>
            </Button>
            <DeleteTemplateDialog
              templateId={template.id}
              templateName={template.name}
            />
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Content
            </h3>
            <div className="rounded-2xl border border-border/60 bg-background">
              <TiptapEditor
                content={template.content}
                editable={false}
              />
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Fields ({template.fields.length})
            </h3>
            {template.fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No fields defined for this template.
              </p>
            ) : (
              <div className="space-y-2">
                {template.fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-4 rounded-xl border border-border/60 bg-background px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {field.label}
                      </p>
                      {field.placeholder && (
                        <p className="text-xs text-muted-foreground">
                          {field.placeholder}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {FIELD_TYPE_LABELS[field.type] ?? field.type}
                    </Badge>
                    {field.required && (
                      <Badge className="shrink-0 text-xs">Required</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
