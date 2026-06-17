import { z } from "zod";

export const templateFieldSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Field label is required"),
  type: z.enum(["TEXT", "NUMBER", "DATE", "SELECT", "CHECKBOX", "TEXTAREA"]),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  required: z.boolean().default(false),
  options: z.string().optional(),
  renderAs: z.enum(["PLAIN", "BULLET", "NUMBERED"]).default("PLAIN"),
  order: z.number().int().min(0),
});

export const templateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  content: z.string().min(1, "Template content is required"),
  visibility: z.enum(["PRIVATE", "PUBLIC"]).default("PRIVATE"),
  fields: z.array(templateFieldSchema),
});

export type TemplateInput = z.infer<typeof templateSchema>;
export type TemplateFieldInput = z.infer<typeof templateFieldSchema>;
