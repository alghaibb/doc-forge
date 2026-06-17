"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { LoadingButton } from "@/components/ui/button";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import { TemplateFieldsEditor } from "./template-fields-editor";
import { templateSchema, type TemplateFieldInput } from "@/lib/schemas/template";
import type { ActionResult } from "@/lib/types";

interface TemplateData {
  id?: string;
  name: string;
  description: string;
  content: string;
  visibility: "PRIVATE" | "PUBLIC";
  fields: TemplateFieldInput[];
}

interface TemplateFormProps {
  defaultValues?: TemplateData;
  action: (data: unknown) => Promise<ActionResult>;
  submitLabel: string;
  loadingLabel: string;
}

export function TemplateForm({
  defaultValues,
  action,
  submitLabel,
  loadingLabel,
}: TemplateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(defaultValues?.name ?? "");
  const [description, setDescription] = useState(
    defaultValues?.description ?? ""
  );
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [visibility, setVisibility] = useState<"PRIVATE" | "PUBLIC">(
    defaultValues?.visibility ?? "PRIVATE"
  );
  const [fields, setFields] = useState<TemplateFieldInput[]>(
    defaultValues?.fields ?? []
  );

  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {}
  );
  const [globalError, setGlobalError] = useState("");

  function handleSubmit() {
    setErrors({});
    setGlobalError("");

    const data = { name, description, content, visibility, fields };

    const parsed = templateSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const result = await action(parsed.data);
        if (!result.success) {
          if (result.fieldErrors) setErrors(result.fieldErrors);
          if (result.error) setGlobalError(result.error);
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "NEXT_REDIRECT"
        ) {
          return;
        }
        console.error("Template form error:", error);
        setGlobalError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {globalError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {globalError}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <FieldContent>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Invoice Template"
            />
            <FieldError>{errors.name?.[0]}</FieldError>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="visibility">Visibility</FieldLabel>
          <FieldContent>
            <Select
              value={visibility}
              onValueChange={(v) =>
                setVisibility(v as "PRIVATE" | "PUBLIC")
              }
            >
              <SelectTrigger id="visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="PUBLIC">Public</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </div>

      <Field data-invalid={!!errors.description}>
        <FieldLabel htmlFor="description">
          Description{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this template"
            rows={3}
          />
          <FieldError>{errors.description?.[0]}</FieldError>
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.content}>
        <FieldLabel>Content</FieldLabel>
        <FieldContent>
          <p className="mb-2 text-xs text-muted-foreground">
            Type{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[11px] text-foreground">
              {"{{Field Label}}"}
            </code>{" "}
            or click a field chip below the toolbar to insert a merge field.
            These get replaced with real values when you create a document from
            this template.
          </p>
          <p className="mb-2 text-xs text-muted-foreground">
            Tip: for a TEXTAREA field set to bullet / numbered, put{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[11px] text-foreground">
              {"{{Your List Field}}"}
            </code>{" "}
            on its own line to render as a list. Inline usage falls back to
            comma-separated text.
          </p>
          <TiptapEditor
            content={content || undefined}
            onChange={setContent}
            placeholder="Write the template content here..."
            insertableFields={fields
              .filter((f) => f.label.trim().length > 0)
              .map((f) => ({ label: f.label }))}
          />
          <FieldError>{errors.content?.[0]}</FieldError>
        </FieldContent>
      </Field>

      <TemplateFieldsEditor fields={fields} onChange={setFields} />

      <div className="flex items-center gap-3 border-t border-border/40 pt-6">
        <LoadingButton
          type="submit"
          loading={isPending}
          loadingText={loadingLabel}
        >
          {submitLabel}
        </LoadingButton>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
