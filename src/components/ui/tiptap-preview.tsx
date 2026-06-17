"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapPreviewProps {
  content: string;
}

function parseContent(content: string): JSONContent | string {
  if (!content) return "";
  try {
    return JSON.parse(content) as JSONContent;
  } catch (error) {
    console.error("TiptapPreview: failed to parse content JSON", error);
    return "";
  }
}

export function TiptapPreview({ content }: TiptapPreviewProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: parseContent(content),
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none px-4 py-3 min-h-[200px] focus:outline-none text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-li:text-foreground",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const next = parseContent(content);
    editor.commands.setContent(next);
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-background">
      <EditorContent editor={editor} />
    </div>
  );
}
