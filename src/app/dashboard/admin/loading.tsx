/* ============================================================
   ADMIN LOADING STATE
   ============================================================ */

export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-64 bg-space-700 rounded-xl mb-3" />
      <div className="h-5 w-80 bg-space-700 rounded-lg mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-space-700/80 border border-card-border text-center">
            <div className="h-8 w-8 bg-space-600 rounded-lg mx-auto mb-2" />
            <div className="h-6 w-12 bg-space-600 rounded-lg mx-auto mb-1" />
            <div className="h-3 w-16 bg-space-600 rounded-lg mx-auto" />
          </div>
        ))}
      </div>
      <div className="h-48 bg-space-700/80 rounded-2xl border border-card-border" />
    </div>
  );
}
