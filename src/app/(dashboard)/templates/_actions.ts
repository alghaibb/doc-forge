"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { templateSchema } from "@/lib/schemas/template";
import type { ActionResult } from "@/lib/types";

async function requireUser() {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  return session.user;
}

async function requireTemplateOwner(templateId: string, userId: string) {
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    select: { userId: true },
  });

  if (!template || template.userId !== userId) {
    throw new Error("Template not found");
  }
}

export async function createTemplate(raw: unknown): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = templateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, description, content, visibility, fields } = parsed.data;

  try {
    const template = await prisma.template.create({
      data: {
        name,
        description: description ?? null,
        content,
        visibility,
        userId: user.id,
        fields: {
          create: fields.map((f) => ({
            label: f.label,
            type: f.type,
            placeholder: f.placeholder ?? null,
            defaultValue: f.defaultValue ?? null,
            required: f.required,
            options: f.options ?? null,
            renderAs: f.renderAs,
            order: f.order,
          })),
        },
      },
    });

    revalidatePath("/templates");
    redirect(`/templates/${template.id}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    console.error("Create template error:", error);
    return { success: false, error: "Failed to create template" };
  }
}

export async function updateTemplate(
  templateId: string,
  raw: unknown
): Promise<ActionResult> {
  const user = await requireUser();
  await requireTemplateOwner(templateId, user.id);

  const parsed = templateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, description, content, visibility, fields } = parsed.data;

  try {
    const existingFields = await prisma.templateField.findMany({
      where: { templateId },
      select: { id: true },
    });
    const existingIds = new Set(existingFields.map((f) => f.id));
    const incomingIds = new Set(
      fields.filter((f) => f.id).map((f) => f.id as string)
    );

    const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));

    await prisma.$transaction([
      prisma.template.update({
        where: { id: templateId },
        data: { name, description: description ?? null, content, visibility },
      }),

      ...(toDelete.length > 0
        ? [
            prisma.templateField.deleteMany({
              where: { id: { in: toDelete } },
            }),
          ]
        : []),

      ...fields.map((f) =>
        f.id && existingIds.has(f.id)
          ? prisma.templateField.update({
              where: { id: f.id },
              data: {
                label: f.label,
                type: f.type,
                placeholder: f.placeholder ?? null,
                defaultValue: f.defaultValue ?? null,
                required: f.required,
                options: f.options ?? null,
                renderAs: f.renderAs,
                order: f.order,
              },
            })
          : prisma.templateField.create({
              data: {
                label: f.label,
                type: f.type,
                placeholder: f.placeholder ?? null,
                defaultValue: f.defaultValue ?? null,
                required: f.required,
                options: f.options ?? null,
                renderAs: f.renderAs,
                order: f.order,
                templateId,
              },
            })
      ),
    ]);

    revalidatePath("/templates");
    revalidatePath(`/templates/${templateId}`);
    redirect(`/templates/${templateId}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    console.error("Update template error:", error);
    return { success: false, error: "Failed to update template" };
  }
}

export async function deleteTemplate(templateId: string): Promise<ActionResult> {
  const user = await requireUser();
  await requireTemplateOwner(templateId, user.id);

  try {
    await prisma.template.delete({ where: { id: templateId } });
    revalidatePath("/templates");
    redirect("/templates");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    console.error("Delete template error:", error);
    return { success: false, error: "Failed to delete template" };
  }
}
