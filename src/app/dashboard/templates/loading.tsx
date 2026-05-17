/* ============================================================
   TEMPLATES LOADING STATE
   ============================================================ */

export default function TemplatesLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-64 bg-space-700 rounded-xl mb-3" />
      <div className="h-5 w-96 bg-space-700 rounded-lg mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="h-40 bg-space-600 rounded-xl mb-4" />
            <div className="h-5 w-32 bg-space-600 rounded-lg mb-2" />
            <div className="h-4 w-24 bg-space-600 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
