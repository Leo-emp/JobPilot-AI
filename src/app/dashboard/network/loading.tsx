export default function NetworkLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-44 bg-space-700 rounded-xl mb-3" />
      <div className="h-5 w-72 bg-space-700 rounded-lg mb-8" />
      <div className="flex gap-3 mb-6">
        <div className="h-10 w-28 bg-space-700 rounded-lg" />
        <div className="h-10 w-28 bg-space-700 rounded-lg" />
        <div className="h-10 w-28 bg-space-700 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="h-5 w-36 bg-space-600 rounded-lg mb-3" />
            <div className="h-4 w-24 bg-space-600 rounded-lg mb-2" />
            <div className="h-4 w-48 bg-space-600 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
