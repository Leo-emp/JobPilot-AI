/* ============================================================
   AI DISCLOSURE NOTICE — Legal Transparency
   ============================================================
   Small notice displayed alongside AI-generated content.
   Required for compliance and user trust — clearly states that
   output is AI-generated and should be reviewed before use.
   ============================================================ */

export default function AiDisclosure() {
  return (
    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-brand-indigo/5 border border-brand-indigo/15 mt-3">
      {/* AI icon */}
      <svg
        className="w-4 h-4 text-brand-light shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
        />
      </svg>
      <p className="text-xs text-text-muted leading-relaxed">
        <span className="text-brand-light font-medium">AI-generated content.</span>{" "}
        This output was created by AI and may contain inaccuracies. Review and edit before using in applications.
      </p>
    </div>
  );
}
