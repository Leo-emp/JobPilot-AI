/* # Loading skeleton for the portfolio editor */

export default function PortfolioLoading() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 animate-pulse">
      <div className="h-8 w-64 bg-space-700 rounded-lg mb-2" />
      <div className="h-4 w-96 bg-space-700 rounded mb-8" />
      <div className="h-12 bg-space-700 rounded-xl mb-4" />
      <div className="h-12 bg-space-700 rounded-xl mb-4" />
      <div className="h-12 bg-space-700 rounded-xl mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-space-700 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
