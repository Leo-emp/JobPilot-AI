/* ============================================================
   MARKDOWN RENDERER — Workshop Content Renderer
   ============================================================
   # Renders Markdown content from workshop sections.
   # Handles: headings, paragraphs, code blocks, lists,
   #   tables, blockquotes, links, bold/italic, images.
   # Special blocks: :::exercise, :::quiz, :::hint, :::solution
   ============================================================ */

"use client";

import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";

interface MarkdownRendererProps {
  content: string;
  /* # Profession color for accent elements */
  color: string;
}

/* # Parse a simple markdown string into React-safe HTML.
   # Output is sanitised through DOMPurify to prevent stored XSS
   # even if workshop content is compromised. */
function parseInline(text: string): string {
  const raw = text
    /* # Code inline: `code` */
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-sm font-mono text-indigo-300">$1</code>')
    /* # Bold + italic: ***text*** */
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    /* # Bold: **text** */
    .replace(/\*\*(.+?)\*\*/g, "<strong class=\"text-white font-semibold\">$1</strong>")
    /* # Italic: *text* */
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    /* # Links: [text](url) */
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">$1</a>'
    );
  return DOMPurify.sanitize(raw, { ADD_ATTR: ["target", "rel", "class"] });
}

/* # Parse full markdown content into structured blocks */
interface Block {
  type: "heading" | "paragraph" | "code" | "list" | "table" | "blockquote" | "hr" | "empty";
  level?: number; /* # For headings: 1-6 */
  lang?: string; /* # For code blocks: language */
  content: string;
  items?: string[]; /* # For lists */
  ordered?: boolean; /* # For lists */
  rows?: string[][]; /* # For tables */
  headerRow?: string[]; /* # For tables */
}

function parseMarkdown(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* # Empty line */
    if (line.trim() === "") {
      i++;
      continue;
    }

    /* # Horizontal rule */
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(line.trim())) {
      blocks.push({ type: "hr", content: "" });
      i++;
      continue;
    }

    /* # Heading: # to ###### */
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        content: headingMatch[2],
      });
      i++;
      continue;
    }

    /* # Code block: ``` */
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: "code",
        lang: lang || undefined,
        content: codeLines.join("\n"),
      });
      i++; /* # Skip closing ``` */
      continue;
    }

    /* # Table: | header | header | */
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      /* # Parse table rows */
      const parsed = tableLines
        .filter((l) => !/^\|[\s-:|]+\|$/.test(l.trim())) /* # Skip separator row */
        .map((l) =>
          l
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim())
        );
      if (parsed.length > 0) {
        blocks.push({
          type: "table",
          content: "",
          headerRow: parsed[0],
          rows: parsed.slice(1),
        });
      }
      continue;
    }

    /* # Blockquote: > text */
    if (line.trimStart().startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith("> ")) {
        quoteLines.push(lines[i].trimStart().slice(2));
        i++;
      }
      blocks.push({
        type: "blockquote",
        content: quoteLines.join("\n"),
      });
      continue;
    }

    /* # Ordered list: 1. item */
    if (/^\d+\.\s+/.test(line.trimStart())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trimStart())) {
        items.push(lines[i].trimStart().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "list", content: "", items, ordered: true });
      continue;
    }

    /* # Unordered list: - item or * item */
    if (/^[-*]\s+/.test(line.trimStart())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trimStart())) {
        items.push(lines[i].trimStart().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "list", content: "", items, ordered: false });
      continue;
    }

    /* # Regular paragraph */
    const paraLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trimStart().startsWith("> ") &&
      !/^[-*]\s+/.test(lines[i].trimStart()) &&
      !/^\d+\.\s+/.test(lines[i].trimStart()) &&
      !/^(-{3,}|_{3,}|\*{3,})$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", content: paraLines.join(" ") });
  }

  return blocks;
}

export default function MarkdownRenderer({ content, color }: MarkdownRendererProps) {
  const blocks = useMemo(() => parseMarkdown(content), [content]);

  /* # Heading size classes mapped by level */
  const headingSizes: Record<number, string> = {
    1: "text-3xl font-bold mt-8 mb-4",
    2: "text-2xl font-bold mt-8 mb-3",
    3: "text-xl font-semibold mt-6 mb-2",
    4: "text-lg font-semibold mt-4 mb-2",
    5: "text-base font-semibold mt-4 mb-1",
    6: "text-sm font-semibold mt-3 mb-1 uppercase tracking-wide",
  };

  return (
    <div className="workshop-content space-y-4">
      {blocks.map((block, idx) => {
        switch (block.type) {
          /* # Render headings with Space Grotesk */
          case "heading":
            return (
              <div
                key={idx}
                className={`font-[family-name:var(--font-space-grotesk)] text-white ${headingSizes[block.level || 2]}`}
                dangerouslySetInnerHTML={{ __html: parseInline(block.content) }}
              />
            );

          /* # Render paragraphs */
          case "paragraph":
            return (
              <p
                key={idx}
                className="text-text-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: parseInline(block.content) }}
              />
            );

          /* # Render code blocks with syntax styling */
          case "code":
            return (
              <div key={idx} className="relative group">
                {block.lang && (
                  <div
                    className="absolute top-0 right-0 px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-bl-lg rounded-tr-lg"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {block.lang}
                  </div>
                )}
                <pre className="bg-black/40 border border-card-border rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                    {block.content}
                  </code>
                </pre>
              </div>
            );

          /* # Render lists */
          case "list":
            if (block.ordered) {
              return (
                <ol key={idx} className="space-y-2 pl-6 list-decimal">
                  {block.items?.map((item, j) => (
                    <li
                      key={j}
                      className="text-text-secondary leading-relaxed marker:text-text-muted"
                      dangerouslySetInnerHTML={{ __html: parseInline(item) }}
                    />
                  ))}
                </ol>
              );
            }
            return (
              <ul key={idx} className="space-y-2 pl-6 list-disc">
                {block.items?.map((item, j) => (
                  <li
                    key={j}
                    className="text-text-secondary leading-relaxed marker:text-text-muted"
                    dangerouslySetInnerHTML={{ __html: parseInline(item) }}
                  />
                ))}
              </ul>
            );

          /* # Render tables */
          case "table":
            return (
              <div key={idx} className="overflow-x-auto rounded-lg border border-card-border">
                <table className="w-full text-sm">
                  {block.headerRow && (
                    <thead>
                      <tr className="border-b border-card-border bg-white/5">
                        {block.headerRow.map((cell, j) => (
                          <th
                            key={j}
                            className="px-4 py-3 text-left font-semibold text-white"
                            dangerouslySetInnerHTML={{ __html: parseInline(cell) }}
                          />
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {block.rows?.map((row, j) => (
                      <tr key={j} className="border-b border-card-border/50 last:border-0">
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className="px-4 py-3 text-text-secondary"
                            dangerouslySetInnerHTML={{ __html: parseInline(cell) }}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          /* # Render blockquotes */
          case "blockquote":
            return (
              <blockquote
                key={idx}
                className="border-l-4 pl-4 py-2 text-text-secondary italic"
                style={{ borderColor: color }}
                dangerouslySetInnerHTML={{ __html: parseInline(block.content) }}
              />
            );

          /* # Render horizontal rules */
          case "hr":
            return <hr key={idx} className="border-card-border my-6" />;

          default:
            return null;
        }
      })}
    </div>
  );
}
