/* ============================================================
   useDefaultResume — Load the user's designated default resume
   ============================================================
   Fetches the resume the user explicitly set as default (via
   onboarding or account settings). Feature pages use this to
   pre-fill the resume field on mount.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";

interface DefaultResume {
  id: string;
  content: string;
  fileName: string;
}

export function useDefaultResume() {
  const [defaultResume, setDefaultResume] = useState<DefaultResume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/default-resume")
      .then(r => r.ok ? r.json() : { data: null })
      .then(data => {
        if (data.data) {
          setDefaultResume(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { defaultResume, loading };
}
