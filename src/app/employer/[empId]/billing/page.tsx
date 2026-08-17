/* ============================================================
   EMPLOYER BILLING — Subscription management page
   ============================================================
   Shows current plan, usage stats, and upgrade/manage options.
   Owner-only page — redirects non-owners.

   Plans:
   - Free: 1 role, basic matching, limited profiles
   - Pro ($299/mo): 5 roles, full profiles, shortlists
   - Enterprise ($999/mo): unlimited roles, AI outreach, external sourcing
   ============================================================ */

"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";

/* # Plan features for display */
const PLANS = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    interval: "",
    features: [
      "1 active role",
      "Basic matching (top 10)",
      "Limited candidate profiles",
      "5 bookmarks/month",
      "Mutual interest messaging",
    ],
    cta: "Current Plan",
  },
  {
    key: "pro",
    name: "Pro",
    price: "$299",
    interval: "/month",
    features: [
      "5 active roles",
      "Full ranked matching",
      "Full candidate profiles + scores",
      "50 bookmarks/month",
      "Shortlist delivery (internal)",
      "Email support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "$999",
    interval: "/month",
    features: [
      "Unlimited active roles",
      "Full matching + external sourcing",
      "AI candidate summaries",
      "Unlimited bookmarks",
      "AI outreach pipeline",
      "Shortlists (internal + external)",
      "Direct messaging",
      "Priority support + Slack",
    ],
    cta: "Upgrade to Enterprise",
  },
];

interface UsageData {
  rolesPosted: number;
  candidatesContacted: number;
  matchesViewed: number;
  bookmarksUsed: number;
  shortlistsDelivered: number;
}

export default function BillingPage({
  params,
}: {
  params: Promise<{ empId: string }>;
}) {
  const { empId } = use(params);
  const searchParams = useSearchParams();
  const [currentPlan, setCurrentPlan] = useState("free");
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  /* # Show success/cancel banners from Stripe redirect */
  const upgraded = searchParams.get("upgraded") === "true";
  const cancelled = searchParams.get("cancelled") === "true";

  /* # Fetch employer plan and usage */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/employer/${empId}`);
        const data = await res.json();
        setCurrentPlan(data.employer?.plan ?? "free");

        /* # Fetch usage */
        const usageRes = await fetch(`/api/employer/${empId}/billing/usage`);
        if (usageRes.ok) {
          const usageData = await usageRes.json();
          setUsage(usageData.usage);
        }
      } catch (err) {
        console.error("Failed to load billing:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [empId]);

  /* # Handle checkout redirect */
  async function handleUpgrade(plan: string) {
    setUpgrading(plan);
    try {
      const res = await fetch(`/api/employer/${empId}/billing/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval: "month" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Failed to connect to billing. Please try again.");
    } finally {
      setUpgrading(null);
    }
  }

  /* # Handle billing portal */
  async function handleManage() {
    try {
      const res = await fetch(`/api/employer/${empId}/billing/portal`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to open billing portal");
      }
    } catch {
      alert("Failed to connect to billing portal.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted">Loading billing...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* # Success/cancel banners */}
      {upgraded && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300">
          Your plan has been upgraded successfully. New features are now active.
        </div>
      )}
      {cancelled && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">
          Checkout was cancelled. No changes were made to your plan.
        </div>
      )}

      {/* # Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted mt-1">
          Manage your subscription and view usage.
        </p>
      </div>

      {/* # Current plan + manage button */}
      {currentPlan !== "free" && (
        <div className="p-4 rounded-lg bg-card border border-card-border flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Current Plan</p>
            <p className="text-lg font-semibold text-foreground capitalize">
              {currentPlan}
            </p>
          </div>
          <button
            onClick={handleManage}
            className="px-4 py-2 rounded-lg bg-card border border-card-border text-sm text-foreground hover:bg-card-border/50 transition-colors"
          >
            Manage Subscription
          </button>
        </div>
      )}

      {/* # Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = plan.key === currentPlan;
          const isDowngrade =
            (currentPlan === "enterprise" && plan.key !== "enterprise") ||
            (currentPlan === "pro" && plan.key === "free");

          return (
            <div
              key={plan.key}
              className={`relative p-6 rounded-xl border transition-all ${
                isCurrent
                  ? "bg-indigo-500/10 border-indigo-500/50"
                  : "bg-card border-card-border hover:border-indigo-500/30"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-indigo-500 text-white font-medium">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-foreground">
                {plan.name}
              </h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted">{plan.interval}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <svg
                      className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-2.5 rounded-lg text-center text-sm font-medium bg-indigo-500/20 text-indigo-300">
                  Current Plan
                </div>
              ) : isDowngrade ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-lg text-sm font-medium bg-card border border-card-border text-muted cursor-not-allowed"
                >
                  Downgrade via Portal
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.key)}
                  disabled={upgrading === plan.key}
                  className="w-full py-2.5 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-50"
                >
                  {upgrading === plan.key ? "Redirecting..." : plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* # Usage stats */}
      {usage && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            This Month&apos;s Usage
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Roles Posted", value: usage.rolesPosted },
              { label: "Candidates Contacted", value: usage.candidatesContacted },
              { label: "Matches Viewed", value: usage.matchesViewed },
              { label: "Bookmarks Used", value: usage.bookmarksUsed },
              { label: "Shortlists Delivered", value: usage.shortlistsDelivered },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-lg bg-card border border-card-border"
              >
                <p className="text-xs text-muted">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
