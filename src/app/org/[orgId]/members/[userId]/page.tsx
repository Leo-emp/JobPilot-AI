/* ============================================================
   MEMBER DETAIL — Individual candidate activity view
   ============================================================
   Shows per-candidate activity: application pipeline, AI usage,
   resume/cover letter counts. Gated by org dataVisibility.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface MemberDetail {
  id: string;
  name: string | null;
  email: string;
}

interface ActivityData {
  applicationPipeline: Record<string, number>;
  aiUsageByAction: Record<string, number>;
  resumeCount: number;
  coverLetterCount: number;
  recentApplications?: Array<{
    id: string;
    jobTitle: string;
    company: string;
    status: string;
    appliedAt: string;
  }>;
  recentAiResults?: Array<{
    id: string;
    action: string;
    title: string;
    createdAt: string;
  }>;
}

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.orgId as string;
  const userId = params.userId as string;
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/org/${orgId}/members/${userId}`).then((r) => r.json()),
      fetch(`/api/org/${orgId}/members/${userId}/activity`).then((r) => r.json()),
    ])
      .then(([memberData, activityData]) => {
        setMember(memberData.member?.user || null);
        setActivity(activityData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orgId, userId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-9 w-64 bg-space-700 rounded-xl mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-space-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!member || !activity) {
    return <p className="text-gray-400 py-10 text-center">Member not found.</p>;
  }

  /* # Pipeline visualization */
  const totalApps = Object.values(activity.applicationPipeline).reduce((a, b) => a + b, 0);

  const pipelineStages = [
    { key: "saved", label: "Saved", color: "bg-gray-500" },
    { key: "applied", label: "Applied", color: "bg-blue-500" },
    { key: "interviewing", label: "Interview", color: "bg-amber-500" },
    { key: "offered", label: "Offered", color: "bg-emerald-500" },
    { key: "rejected", label: "Rejected", color: "bg-red-500" },
  ];

  return (
    <div>
      {/* # Back button + header */}
      <button
        onClick={() => router.back()}
        className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Members
      </button>

      <h1 className="text-2xl font-bold text-white mb-1">{member.name || "Unnamed"}</h1>
      <p className="text-gray-400 mb-8">{member.email}</p>

      {/* # Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-space-800 border border-card-border rounded-xl">
          <p className="text-sm text-gray-400">Resumes</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{activity.resumeCount}</p>
        </div>
        <div className="p-4 bg-space-800 border border-card-border rounded-xl">
          <p className="text-sm text-gray-400">Cover Letters</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{activity.coverLetterCount}</p>
        </div>
        <div className="p-4 bg-space-800 border border-card-border rounded-xl">
          <p className="text-sm text-gray-400">Applications</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{totalApps}</p>
        </div>
        <div className="p-4 bg-space-800 border border-card-border rounded-xl">
          <p className="text-sm text-gray-400">AI Calls</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">
            {Object.values(activity.aiUsageByAction).reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </div>

      {/* # Application pipeline */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Application Pipeline</h2>
        <div className="flex gap-2 items-end h-24">
          {pipelineStages.map((stage) => {
            const count = activity.applicationPipeline[stage.key] || 0;
            const height = totalApps > 0 ? Math.max(8, (count / totalApps) * 100) : 8;
            return (
              <div key={stage.key} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{count}</span>
                <div
                  className={`w-full ${stage.color} rounded-t-lg transition-all`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500 mt-1">{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* # AI usage breakdown */}
      {Object.keys(activity.aiUsageByAction).length > 0 && (
        <div className="p-6 bg-space-800 border border-card-border rounded-xl mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">AI Usage by Action</h2>
          <div className="space-y-2">
            {Object.entries(activity.aiUsageByAction)
              .sort(([, a], [, b]) => b - a)
              .map(([action, count]) => (
                <div key={action} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 capitalize">{action.replace(/_/g, " ")}</span>
                  <span className="text-sm text-gray-400">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* # Recent applications (if full visibility) */}
      {activity.recentApplications && activity.recentApplications.length > 0 && (
        <div className="p-6 bg-space-800 border border-card-border rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Applications</h2>
          <div className="space-y-3">
            {activity.recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between py-2 border-b border-card-border last:border-0">
                <div>
                  <p className="text-sm text-white">{app.jobTitle}</p>
                  <p className="text-xs text-gray-500">{app.company}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-space-700 text-gray-300 px-2 py-0.5 rounded-full capitalize">
                    {app.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
