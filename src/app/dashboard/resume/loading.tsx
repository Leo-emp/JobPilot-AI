export default function ResumeLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-56 bg-space-700 rounded-xl mb-3" />
      <div className="h-5 w-80 bg-space-700 rounded-lg mb-8" />
      <div className="flex gap-3 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-32 bg-space-700 rounded-lg" />
        ))}
      </div>
      <div className="glass-card p-8">
        <div className="h-40 bg-space-600 rounded-xl mb-6" />
        <div className="h-12 w-48 bg-space-600 rounded-xl" />
      </div>
    </div>
  );
}
