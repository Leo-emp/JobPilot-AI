export default function HistoryLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-40 bg-space-700 rounded-xl mb-3" />
      <div className="h-5 w-64 bg-space-700 rounded-lg mb-8" />
      <div className="flex gap-3 mb-6">
        <div className="h-9 w-20 bg-space-700 rounded-lg" />
        <div className="h-9 w-28 bg-space-700 rounded-lg" />
        <div className="h-9 w-28 bg-space-700 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card p-4 flex items-center justify-between">
            <div>
              <div className="h-4 w-48 bg-space-600 rounded-lg mb-2" />
              <div className="h-3 w-24 bg-space-600 rounded-lg" />
            </div>
            <div className="h-3 w-20 bg-space-600 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
