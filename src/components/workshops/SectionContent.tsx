/* ============================================================
   SECTION CONTENT — Parses and renders section content
   ============================================================
   # Splits Markdown content from embedded quiz/exercise JSON.
   # Renders markdown with MarkdownRenderer.
   # Renders quizzes with QuizBlock.
   # Content format:
   #   Regular markdown...
   #   <!--quiz [...JSON...] -->
   #   More markdown...
   ============================================================ */

"use client";

import MarkdownRenderer from "./MarkdownRenderer";
import QuizBlock from "./QuizBlock";

interface SectionContentProps {
  /* # Raw content string from DB (markdown + embedded quiz JSON) */
  content: string;
  /* # Section ID for saving quiz progress */
  sectionId: string;
  /* # Profession accent color */
  color: string;
}

/* # Parse content into segments: markdown text and quiz blocks */
interface ContentSegment {
  type: "markdown" | "quiz";
  content: string;
  quizData?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

function parseContent(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  /* # Split on <!--quiz ... --> blocks */
  const quizRegex = /<!--quiz\s*([\s\S]*?)-->/g;
  let lastIndex = 0;
  let match;

  while ((match = quizRegex.exec(content)) !== null) {
    /* # Add markdown before the quiz block */
    const beforeQuiz = content.slice(lastIndex, match.index).trim();
    if (beforeQuiz) {
      segments.push({ type: "markdown", content: beforeQuiz });
    }

    /* # Parse the quiz JSON */
    try {
      const quizData = JSON.parse(match[1].trim());
      segments.push({ type: "quiz", content: "", quizData });
    } catch {
      /* # If JSON parse fails, treat as markdown */
      segments.push({ type: "markdown", content: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  /* # Add remaining markdown after last quiz block */
  const remaining = content.slice(lastIndex).trim();
  if (remaining) {
    segments.push({ type: "markdown", content: remaining });
  }

  return segments;
}

export default function SectionContent({ content, sectionId, color }: SectionContentProps) {
  const segments = parseContent(content);

  return (
    <div className="space-y-6">
      {segments.map((segment, i) => {
        if (segment.type === "quiz" && segment.quizData) {
          return (
            <QuizBlock
              key={i}
              questions={segment.quizData}
              sectionId={sectionId}
              color={color}
            />
          );
        }
        return (
          <MarkdownRenderer
            key={i}
            content={segment.content}
            color={color}
          />
        );
      })}
    </div>
  );
}
