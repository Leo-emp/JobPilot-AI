/* ============================================================
   DASHBOARD LOADING STATE
   ============================================================
   Shown while dashboard pages are loading (server components).
   Uses skeleton placeholders that match the dashboard layout.
   ============================================================ */

export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Page title skeleton */}
      <div className="h-9 w-64 bg-space-700 rounded-xl mb-3" />
      <div className="h-5 w-96 bg-space-700 rounded-lg mb-10" />

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 sm:p-6">
            <div className="h-8 w-8 bg-space-600 rounded-lg mb-3" />
            <div className="h-8 w-16 bg-space-600 rounded-lg mb-2" />
            <div className="h-4 w-24 bg-space-600 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="h-6 w-40 bg-space-700 rounded-lg mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6 sm:p-8">
            <div className="h-8 w-8 bg-space-600 rounded-lg mb-4" />
            <div className="h-5 w-40 bg-space-600 rounded-lg mb-3" />
            <div className="h-4 w-full bg-space-600 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
