export default function CoverLetterLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-64 bg-space-700 rounded-xl mb-3" />
      <div className="h-5 w-96 bg-space-700 rounded-lg mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-8">
          <div className="space-y-4">
            <div className="h-10 bg-space-600 rounded-xl" />
            <div className="h-10 bg-space-600 rounded-xl" />
            <div className="h-10 bg-space-600 rounded-xl" />
            <div className="h-32 bg-space-600 rounded-xl" />
          </div>
        </div>
        <div className="glass-card p-8">
          <div className="h-6 w-40 bg-space-600 rounded-lg mb-6" />
          <div className="h-64 bg-space-600 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
