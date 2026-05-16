export default function InterviewLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-52 bg-space-700 rounded-xl mb-3" />
      <div className="h-5 w-72 bg-space-700 rounded-lg mb-8" />
      <div className="flex gap-3 mb-8">
        <div className="h-10 w-40 bg-space-700 rounded-lg" />
        <div className="h-10 w-40 bg-space-700 rounded-lg" />
      </div>
      <div className="glass-card p-8">
        <div className="space-y-4">
          <div className="h-10 bg-space-600 rounded-xl" />
          <div className="h-10 bg-space-600 rounded-xl" />
          <div className="h-32 bg-space-600 rounded-xl" />
          <div className="h-12 w-48 bg-space-600 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
