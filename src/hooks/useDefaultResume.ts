/* ============================================================
   useDefaultResume — Auto-load the user's most recent resume
   ============================================================
   Fetches the latest saved resume on mount so feature pages
   (Resume Intelligence, Cover Letter, Interview Prep) can
   pre-fill the resume field instead of starting blank.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";

interface DefaultResume {
  content: string;
  fileName: string;
}

export function useDefaultResume() {
  const [defaultResume, setDefaultResume] = useState<DefaultResume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resumes?limit=1&sort=createdAt&order=desc")
      .then(r => r.ok ? r.json() : { data: [] })
      .then(data => {
        const latest = data.data?.[0];
        if (latest?.content) {
          setDefaultResume({ content: latest.content, fileName: latest.fileName });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { defaultResume, loading };
}
