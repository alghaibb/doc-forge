import { z } from "zod";

export const documentFieldValueSchema = z.object({
  fieldId: z.string().min(1),
  value: z.string(),
});

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  templateId: z.string().min(1, "Template is required"),
  fieldValues: z.array(documentFieldValueSchema),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type DocumentFieldValueInput = z.infer<typeof documentFieldValueSchema>;
