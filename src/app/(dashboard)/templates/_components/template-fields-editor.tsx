"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { TemplateFieldInput } from "@/lib/schemas/template";

const FIELD_TYPES = [
  { value: "TEXT", label: "Text" },
  { value: "NUMBER", label: "Number" },
  { value: "DATE", label: "Date" },
  { value: "SELECT", label: "Select" },
  { value: "CHECKBOX", label: "Checkbox" },
  { value: "TEXTAREA", label: "Textarea" },
] as const;

const RENDER_AS_OPTIONS = [
  { value: "PLAIN", label: "Plain text" },
  { value: "BULLET", label: "Bullet list" },
  { value: "NUMBERED", label: "Numbered list" },
] as const;

interface TemplateFieldsEditorProps {
  fields: TemplateFieldInput[];
  onChange: (fields: TemplateFieldInput[]) => void;
}

export function TemplateFieldsEditor({
  fields,
  onChange,
}: TemplateFieldsEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function addField() {
    onChange([
      ...fields,
      {
        label: "",
        type: "TEXT",
        required: false,
        renderAs: "PLAIN",
        order: fields.length,
      },
    ]);
    setExpandedIndex(fields.length);
  }

  function removeField(index: number) {
    const updated = fields
      .filter((_, i) => i !== index)
      .map((f, i) => ({ ...f, order: i }));
    onChange(updated);
    if (expandedIndex === index) setExpandedIndex(null);
  }

  function updateField(index: number, partial: Partial<TemplateFieldInput>) {
    const updated = fields.map((f, i) =>
      i === index ? { ...f, ...partial } : f
    );
    onChange(updated);
  }

  function moveField(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= fields.length) return;

    const updated = [...fields];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onChange(updated.map((f, i) => ({ ...f, order: i })));

    if (expandedIndex === index) setExpandedIndex(target);
    else if (expandedIndex === target) setExpandedIndex(index);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Template Fields</p>
        <Button type="button" variant="outline" size="sm" onClick={addField}>
          <Plus className="size-4" />
          Add field
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No fields yet. Add fields that users will fill in when creating
            documents from this template.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/60 bg-background"
          >
            <div className="flex items-center gap-2 px-3 py-2.5">
              <GripVertical className="size-4 shrink-0 text-muted-foreground/50" />

              <Input
                value={field.label}
                onChange={(e) =>
                  updateField(index, { label: e.target.value })
                }
                placeholder="Field label"
                className="h-8 flex-1 text-sm"
              />

              <Select
                value={field.type}
                onValueChange={(value) =>
                  updateField(index, {
                    type: value as TemplateFieldInput["type"],
                  })
                }
              >
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                type="button"
                onClick={() =>
                  updateField(index, { required: !field.required })
                }
                className={cn(
                  "shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  field.required
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {field.required ? "Required" : "Optional"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                {expandedIndex === index ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </button>

              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  onClick={() => moveField(index, "up")}
                  disabled={index === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveField(index, "down")}
                  disabled={index === fields.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="size-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeField(index)}
                className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            {expandedIndex === index && (
              <div className="grid gap-3 border-t border-border/40 px-3 py-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Placeholder
                  </label>
                  <Input
                    value={field.placeholder ?? ""}
                    onChange={(e) =>
                      updateField(index, { placeholder: e.target.value })
                    }
                    placeholder="Placeholder text"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Default value
                  </label>
                  <Input
                    value={field.defaultValue ?? ""}
                    onChange={(e) =>
                      updateField(index, { defaultValue: e.target.value })
                    }
                    placeholder="Default value"
                    className="h-8 text-sm"
                  />
                </div>
                {field.type === "SELECT" && (
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Options (comma-separated)
                    </label>
                    <Input
                      value={field.options ?? ""}
                      onChange={(e) =>
                        updateField(index, { options: e.target.value })
                      }
                      placeholder="Option 1, Option 2, Option 3"
                      className="h-8 text-sm"
                    />
                  </div>
                )}
                {field.type === "TEXTAREA" && (
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Render as
                    </label>
                    <Select
                      value={field.renderAs ?? "PLAIN"}
                      onValueChange={(value) =>
                        updateField(index, {
                          renderAs:
                            value as TemplateFieldInput["renderAs"],
                        })
                      }
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RENDER_AS_OPTIONS.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Lines in the value become list items when the token sits
                      alone on a line.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
