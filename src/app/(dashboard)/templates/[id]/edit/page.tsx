import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { DashboardHeader } from "../../../_components/dashboard-header";
import { TemplateForm } from "../../_components/template-form";
import { updateTemplate } from "../../_actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const template = await prisma.template.findUnique({
    where: { id },
    select: { name: true },
  });
  return { title: template ? `Edit ${template.name}` : "Edit Template" };
}

export default async function EditTemplatePage({ params }: PageProps) {
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

  const defaultValues = {
    id: template.id,
    name: template.name,
    description: template.description ?? "",
    content: template.content,
    visibility: template.visibility,
    fields: template.fields.map((f) => ({
      id: f.id,
      label: f.label,
      type: f.type,
      placeholder: f.placeholder ?? undefined,
      defaultValue: f.defaultValue ?? undefined,
      required: f.required,
      options: f.options ?? undefined,
      order: f.order,
    })),
  };

  async function handleUpdate(data: unknown) {
    "use server";
    return updateTemplate(id, data);
  }

  return (
    <>
      <DashboardHeader title={`Edit ${template.name}`} />
      <div className="mx-auto w-full max-w-4xl flex-1 p-6">
        <TemplateForm
          defaultValues={defaultValues}
          action={handleUpdate}
          submitLabel="Save changes"
          loadingLabel="Saving..."
        />
      </div>
    </>
  );
}
