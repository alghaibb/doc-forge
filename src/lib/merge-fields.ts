import type { FieldRenderAs, FieldType } from "@/generated/prisma/enums";

export interface MergeValue {
  label: string;
  type: FieldType;
  renderAs: FieldRenderAs;
  value: string;
}

interface TiptapNode {
  type?: string;
  text?: string;
  content?: TiptapNode[];
  [key: string]: unknown;
}

interface ListEntry {
  renderAs: "BULLET" | "NUMBERED";
  lines: string[];
}

const TOKEN_REGEX = /\{\{\s*([^}]+?)\s*\}\}/g;
const STANDALONE_TOKEN_REGEX = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

function formatValue(v: MergeValue): string {
  if (v.type === "CHECKBOX") {
    return v.value === "true" ? "Yes" : "No";
  }
  if (v.type === "TEXTAREA") {
    return splitLines(v.value).join(", ");
  }
  return v.value;
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function buildLookup(values: MergeValue[]) {
  const textLookup = new Map<string, string>();
  const listLookup = new Map<string, ListEntry>();

  for (const v of values) {
    const key = v.label.trim().toLowerCase();
    const formatted = formatValue(v);

    if (v.type === "TEXTAREA" && v.renderAs !== "PLAIN") {
      const lines = splitLines(v.value);
      if (lines.length > 0) {
        listLookup.set(key, { renderAs: v.renderAs, lines });
      }
    }

    if (!formatted) continue;
    textLookup.set(key, formatted);
  }

  return { textLookup, listLookup };
}

function replaceInText(text: string, lookup: Map<string, string>): string {
  return text.replace(TOKEN_REGEX, (match, rawLabel: string) => {
    const hit = lookup.get(rawLabel.trim().toLowerCase());
    return hit ?? match;
  });
}

function paragraphText(node: TiptapNode): string {
  if (!Array.isArray(node.content)) return "";
  let out = "";
  for (const child of node.content) {
    if (child.type === "text" && typeof child.text === "string") {
      out += child.text;
    }
  }
  return out;
}

function buildListNode(entry: ListEntry): TiptapNode {
  return {
    type: entry.renderAs === "BULLET" ? "bulletList" : "orderedList",
    content: entry.lines.map((line) => ({
      type: "listItem",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: line }],
        },
      ],
    })),
  };
}

function processNodeArray(
  nodes: TiptapNode[],
  textLookup: Map<string, string>,
  listLookup: Map<string, ListEntry>
): TiptapNode[] {
  const out: TiptapNode[] = [];

  for (const node of nodes) {
    if (node.type === "paragraph") {
      const raw = paragraphText(node);
      const match = raw.match(STANDALONE_TOKEN_REGEX);
      if (match) {
        const key = match[1].trim().toLowerCase();
        const listEntry = listLookup.get(key);
        if (listEntry) {
          out.push(buildListNode(listEntry));
          continue;
        }
      }
    }

    walk(node, textLookup, listLookup);
    out.push(node);
  }

  return out;
}

function walk(
  node: TiptapNode,
  textLookup: Map<string, string>,
  listLookup: Map<string, ListEntry>
): void {
  if (node.type === "text" && typeof node.text === "string") {
    node.text = replaceInText(node.text, textLookup);
  }
  if (Array.isArray(node.content)) {
    node.content = processNodeArray(node.content, textLookup, listLookup);
  }
}

export function mergeTiptapContent(
  contentJson: string,
  values: MergeValue[]
): string {
  if (!contentJson) return contentJson;

  let doc: TiptapNode;
  try {
    doc = JSON.parse(contentJson) as TiptapNode;
  } catch (error) {
    console.error("mergeTiptapContent: failed to parse content JSON", error);
    return contentJson;
  }

  const { textLookup, listLookup } = buildLookup(values);
  walk(doc, textLookup, listLookup);

  return JSON.stringify(doc);
}
