/* ============================================================
   TRUST BAR - Social Proof Stats Strip
   ============================================================
   Horizontal bar of key metrics that builds instant credibility.
   Sits between the Hero and Features sections.
   Shows numbers that make visitors feel the product is proven.
   ============================================================ */

const stats = [
  { value: "10,000+", label: "Resumes Optimized" },
  { value: "95%", label: "ATS Pass Rate" },
  { value: "8", label: "AI-Powered Tools" },
  { value: "30s", label: "Average Generation Time" },
];

export default function TrustBar() {
  return (
    <section className="relative z-10 py-12 sm:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              {/* Large stat number with brand glow */}
              <div className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold glow-text mb-1">
                {stat.value}
              </div>
              {/* Label below the number */}
              <div className="text-sm sm:text-base text-text-muted uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
