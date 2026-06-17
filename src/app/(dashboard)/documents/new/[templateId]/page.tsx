import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { DashboardHeader } from "../../../_components/dashboard-header";
import { FillTemplateForm } from "./_components/fill-template-form";

export const metadata: Metadata = {
  title: "New Document",
};

interface FillPageProps {
  params: Promise<{ templateId: string }>;
}

export default async function FillTemplatePage({ params }: FillPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const { templateId } = await params;

  const template = await prisma.template.findUnique({
    where: { id: templateId },
    include: { fields: { orderBy: { order: "asc" } } },
  });

  if (!template || template.userId !== session.user.id) {
    notFound();
  }

  return (
    <>
      <DashboardHeader title={`New document from ${template.name}`} />
      <div className="mx-auto w-full max-w-7xl flex-1 p-6">
        <Link
          href="/documents/new"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to templates
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {template.name}
          </h1>
          {template.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {template.description}
            </p>
          )}
        </div>

        <FillTemplateForm
          template={{
            id: template.id,
            name: template.name,
            content: template.content,
            fields: template.fields.map((f) => ({
              id: f.id,
              label: f.label,
              type: f.type,
              placeholder: f.placeholder,
              defaultValue: f.defaultValue,
              required: f.required,
              options: f.options,
              renderAs: f.renderAs,
              order: f.order,
            })),
          }}
        />
      </div>
    </>
  );
}
