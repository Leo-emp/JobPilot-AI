export default function SettingsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-36 bg-space-700 rounded-xl mb-3" />
      <div className="h-5 w-64 bg-space-700 rounded-lg mb-8" />
      <div className="space-y-6">
        <div className="glass-card p-8">
          <div className="h-6 w-32 bg-space-600 rounded-lg mb-4" />
          <div className="h-4 w-48 bg-space-600 rounded-lg mb-2" />
          <div className="h-4 w-64 bg-space-600 rounded-lg" />
        </div>
        <div className="glass-card p-8">
          <div className="h-6 w-40 bg-space-600 rounded-lg mb-4" />
          <div className="h-20 bg-space-600 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
