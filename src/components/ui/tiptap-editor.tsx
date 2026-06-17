"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Undo,
  Redo,
  Minus,
  Braces,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InsertableField {
  label: string;
}

interface TiptapEditorProps {
  content?: string;
  onChange?: (json: string) => void;
  placeholder?: string;
  editable?: boolean;
  insertableFields?: InsertableField[];
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed",
        active && "bg-muted text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  editable = true,
  insertableFields,
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: content ? JSON.parse(content) : undefined,
    editable,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none px-4 py-3 min-h-[200px] focus:outline-none text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-li:text-foreground",
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange?.(JSON.stringify(e.getJSON()));
    },
  });

  if (!editor) return null;

  const iconSize = "size-4";

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-background transition-colors focus-within:border-ring">
      {editable && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border/50 bg-muted/30 px-2 py-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold className={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic className={iconSize} />
          </ToolbarButton>

          <div className="mx-1 h-5 w-px bg-border/50" />

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className={iconSize} />
          </ToolbarButton>

          <div className="mx-1 h-5 w-px bg-border/50" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list"
          >
            <List className={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Ordered list"
          >
            <ListOrdered className={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code block"
          >
            <Code className={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal rule"
          >
            <Minus className={iconSize} />
          </ToolbarButton>

          <div className="ml-auto flex items-center gap-0.5">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo className={iconSize} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo className={iconSize} />
            </ToolbarButton>
          </div>
        </div>
      )}

      {editable &&
        insertableFields &&
        insertableFields.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-b border-border/50 bg-muted/10 px-2 py-1.5">
            <span className="flex items-center gap-1 pl-1 pr-2 text-xs text-muted-foreground">
              <Braces className="size-3" />
              Insert field
            </span>
            {insertableFields.map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertContent(`{{${f.label}}}`)
                    .run()
                }
                className="rounded-full border border-border/60 bg-background px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                title={`Insert {{${f.label}}}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

      <EditorContent editor={editor} />
    </div>
  );
}
