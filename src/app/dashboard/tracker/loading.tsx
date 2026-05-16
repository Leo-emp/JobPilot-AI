export default function TrackerLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-56 bg-space-700 rounded-xl mb-3" />
      <div className="h-5 w-72 bg-space-700 rounded-lg mb-8" />
      <div className="flex gap-3 mb-6">
        <div className="h-10 w-32 bg-space-700 rounded-lg" />
        <div className="h-10 w-32 bg-space-700 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-5 flex items-center gap-4">
            <div className="h-10 w-10 bg-space-600 rounded-lg" />
            <div className="flex-1">
              <div className="h-4 w-48 bg-space-600 rounded-lg mb-2" />
              <div className="h-3 w-32 bg-space-600 rounded-lg" />
            </div>
            <div className="h-6 w-20 bg-space-600 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
