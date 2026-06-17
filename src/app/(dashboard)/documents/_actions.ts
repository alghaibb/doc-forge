"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { createDocumentSchema } from "@/lib/schemas/document";
import type { ActionResult } from "@/lib/types";

async function requireUser() {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  return session.user;
}

async function requireDocumentOwner(documentId: string, userId: string) {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: { userId: true },
  });

  if (!doc || doc.userId !== userId) {
    throw new Error("Document not found");
  }
}

export async function createDocument(raw: unknown): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = createDocumentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { title, templateId, fieldValues } = parsed.data;

  try {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { userId: true },
    });

    if (!template || template.userId !== user.id) {
      return { success: false, error: "Template not found" };
    }

    const document = await prisma.document.create({
      data: {
        title,
        type: "TEMPLATE",
        status: "DRAFT",
        templateId,
        userId: user.id,
        fieldValues: {
          create: fieldValues.map((fv) => ({
            fieldId: fv.fieldId,
            value: fv.value,
          })),
        },
      },
    });

    revalidatePath("/documents");
    revalidatePath("/dashboard");
    redirect(`/documents/${document.id}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    console.error("Create document error:", error);
    return { success: false, error: "Failed to create document" };
  }
}

export async function deleteDocument(documentId: string): Promise<ActionResult> {
  const user = await requireUser();
  await requireDocumentOwner(documentId, user.id);

  try {
    await prisma.document.delete({ where: { id: documentId } });
    revalidatePath("/documents");
    revalidatePath("/dashboard");
    redirect("/documents");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    console.error("Delete document error:", error);
    return { success: false, error: "Failed to delete document" };
  }
}

export async function toggleDocumentStatus(
  documentId: string
): Promise<ActionResult> {
  const user = await requireUser();
  await requireDocumentOwner(documentId, user.id);

  try {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      select: { status: true },
    });

    if (!doc) return { success: false, error: "Document not found" };

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: doc.status === "DRAFT" ? "COMPLETED" : "DRAFT",
      },
    });

    revalidatePath("/documents");
    revalidatePath(`/documents/${documentId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Toggle document status error:", error);
    return { success: false, error: "Failed to update status" };
  }
}
