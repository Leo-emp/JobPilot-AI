export default function JobsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-48 bg-space-700 rounded-xl mb-3" />
      <div className="h-5 w-72 bg-space-700 rounded-lg mb-8" />
      <div className="flex gap-3 mb-8">
        <div className="h-12 flex-1 bg-space-700 rounded-xl" />
        <div className="h-12 w-32 bg-space-700 rounded-xl" />
        <div className="h-12 w-32 bg-space-700 rounded-xl" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="h-5 w-64 bg-space-600 rounded-lg mb-3" />
            <div className="h-4 w-40 bg-space-600 rounded-lg mb-2" />
            <div className="h-4 w-full bg-space-600 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
