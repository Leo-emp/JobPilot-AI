/* ============================================================
   ORG EXPORT — Download CSV roster (admin+ only)
   ============================================================ */

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function OrgExportPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const [downloading, setDownloading] = useState(false);

  async function handleExport() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/org/${orgId}/export`);
      if (!res.ok) {
        alert("Export failed. You may not have permission.");
        return;
      }

      /* # Download the CSV */
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `org-roster-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Export Data</h1>
      <p className="text-gray-400 mb-8">Download your organization's member roster as a CSV file.</p>

      <div className="p-6 bg-space-800 border border-card-border rounded-xl max-w-lg">
        <h2 className="text-lg font-semibold text-white mb-3">CSV Roster Export</h2>
        <p className="text-sm text-gray-400 mb-6">
          Includes member name, email, role, cohort, join date, and activity counts
          (resumes, applications, AI calls).
        </p>

        <button
          onClick={handleExport}
          disabled={downloading}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {downloading ? "Downloading..." : "Download CSV"}
        </button>
      </div>
    </div>
  );
}
