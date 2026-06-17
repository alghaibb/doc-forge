"use client";

import { useState, useMemo, useTransition } from "react";
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
import { TiptapPreview } from "@/components/ui/tiptap-preview";
import { createDocumentSchema } from "@/lib/schemas/document";
import { mergeTiptapContent } from "@/lib/merge-fields";
import { createDocument } from "../../../_actions";
import type { FieldRenderAs, FieldType } from "@/generated/prisma/enums";

interface TemplateFieldData {
  id: string;
  label: string;
  type: FieldType;
  placeholder: string | null;
  defaultValue: string | null;
  required: boolean;
  options: string | null;
  renderAs: FieldRenderAs;
  order: number;
}

interface FillTemplateFormProps {
  template: {
    id: string;
    name: string;
    content: string;
    fields: TemplateFieldData[];
  };
}

function parseSelectOptions(options: string | null): string[] {
  if (!options) return [];
  return options
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

function formatDateForTitle(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FillTemplateForm({ template }: FillTemplateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(`${template.name} - ${formatDateForTitle()}`);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of template.fields) {
      init[f.id] = f.defaultValue ?? (f.type === "CHECKBOX" ? "false" : "");
    }
    return init;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  const sortedFields = useMemo(
    () => [...template.fields].sort((a, b) => a.order - b.order),
    [template.fields]
  );

  const mergedContent = useMemo(() => {
    return mergeTiptapContent(
      template.content,
      sortedFields.map((f) => ({
        label: f.label,
        type: f.type,
        renderAs: f.renderAs,
        value: values[f.id] ?? "",
      }))
    );
  }, [template.content, sortedFields, values]);

  function setValue(fieldId: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleSubmit() {
    setErrors({});
    setGlobalError("");

    const fieldErrors: Record<string, string> = {};
    for (const f of sortedFields) {
      const v = values[f.id] ?? "";
      if (f.required && !v.trim()) {
        fieldErrors[f.id] = `${f.label} is required`;
      }
    }

    if (!title.trim()) {
      setGlobalError("Title is required");
      return;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    const data = {
      title: title.trim(),
      templateId: template.id,
      fieldValues: sortedFields.map((f) => ({
        fieldId: f.id,
        value: values[f.id] ?? "",
      })),
    };

    const parsed = createDocumentSchema.safeParse(data);
    if (!parsed.success) {
      setGlobalError("Validation failed");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createDocument(parsed.data);
        if (!result.success && result.error) {
          setGlobalError(result.error);
        }
      } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
          return;
        }
        console.error("Fill template form error:", error);
        setGlobalError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6">
        {globalError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {globalError}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="title">Document title</FieldLabel>
          <FieldContent>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
            />
          </FieldContent>
        </Field>

        {sortedFields.length > 0 ? (
          <div className="space-y-5 rounded-2xl border border-border/60 bg-muted/20 p-5">
            <h2 className="text-sm font-semibold text-foreground">Fields</h2>
            {sortedFields.map((f) => (
              <FieldRenderer
                key={f.id}
                field={f}
                value={values[f.id] ?? ""}
                onChange={(v) => setValue(f.id, v)}
                error={errors[f.id]}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
            This template has no fields. You can create the document as-is.
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-border/40 pt-6">
          <LoadingButton
            type="submit"
            loading={isPending}
            loadingText="Creating..."
          >
            Create document
          </LoadingButton>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Document preview
          </h2>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
        <TiptapPreview content={mergedContent} />

        {sortedFields.length > 0 && (
          <div className="mt-4 rounded-2xl border border-border/60 bg-background p-5">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Field values reference
            </h3>
            <dl className="mt-3 space-y-2">
              {sortedFields.map((f) => {
                const v = values[f.id] ?? "";
                const display =
                  f.type === "CHECKBOX"
                    ? v === "true"
                      ? "Yes"
                      : "No"
                    : v || (
                        <span className="italic text-muted-foreground/60">
                          empty
                        </span>
                      );
                return (
                  <div
                    key={f.id}
                    className="flex items-start justify-between gap-4 border-b border-border/40 pb-2 last:border-0 last:pb-0"
                  >
                    <dt className="text-xs font-medium text-muted-foreground">
                      {f.label}
                    </dt>
                    <dd className="text-right text-xs text-foreground">
                      {display}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        )}
      </div>
    </form>
  );
}

interface FieldRendererProps {
  field: TemplateFieldData;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function FieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  const fieldId = `field-${field.id}`;
  const placeholder = field.placeholder ?? "";

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={fieldId}>
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <FieldContent>
        {field.type === "TEXT" && (
          <Input
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}
        {field.type === "NUMBER" && (
          <Input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}
        {field.type === "DATE" && (
          <Input
            id={fieldId}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        {field.type === "TEXTAREA" && (
          <Textarea
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
          />
        )}
        {field.type === "SELECT" && (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger id={fieldId}>
              <SelectValue placeholder={placeholder || "Choose an option"} />
            </SelectTrigger>
            <SelectContent>
              {parseSelectOptions(field.options).map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {field.type === "CHECKBOX" && (
          <label
            htmlFor={fieldId}
            className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
          >
            <input
              id={fieldId}
              type="checkbox"
              checked={value === "true"}
              onChange={(e) => onChange(e.target.checked ? "true" : "false")}
              className="size-4 rounded border-input accent-primary"
            />
            <span className="text-muted-foreground">
              {placeholder || "Toggle this option"}
            </span>
          </label>
        )}
        {error && <FieldError>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
}
