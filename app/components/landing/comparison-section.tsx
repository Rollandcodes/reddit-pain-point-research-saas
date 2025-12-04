import { Check, X } from "lucide-react"

const comparisons = [
  {
    feature: "Time to insights",
    manual: "2-4 weeks",
    painpointradar: "5 minutes",
  },
  {
    feature: "Posts analyzed",
    manual: "50-100 posts",
    painpointradar: "1,000+ per scan",
  },
  {
    feature: "Pattern recognition",
    manual: "Manual note-taking",
    painpointradar: "AI-powered clustering",
  },
  {
    feature: "Sentiment analysis",
    manual: "Subjective guessing",
    painpointradar: "Quantified scores",
  },
  {
    feature: "Opportunity scoring",
    manual: "Gut feeling",
    painpointradar: "Data-driven 0-100 ranking",
  },
  {
    feature: "Pain point clustering",
    manual: "Scattered notes",
    painpointradar: "Auto-grouped themes",
  },
  {
    feature: "Approach",
    manual: "Reactive (wait for mentions)",
    painpointradar: "Proactive (discover patterns)",
  },
  {
    feature: "CSV export",
    manual: false,
    painpointradar: true,
  },
  {
    feature: "Reproducible",
    manual: false,
    painpointradar: true,
  },
]

export function ComparisonSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            Manual Research vs PainPointRadar
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            See why smart founders are switching to automated pain point discovery
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="rounded-lg border overflow-hidden bg-card">
            {/* Header */}
            <div className="grid grid-cols-3 bg-muted/50 border-b">
              <div className="p-4 font-semibold text-sm sm:text-base">Feature</div>
              <div className="p-4 font-semibold text-sm sm:text-base text-center border-x">
                Manual Research
              </div>
              <div className="p-4 font-semibold text-sm sm:text-base text-center text-radar-600">
                PainPointRadar
              </div>
            </div>

            {/* Rows */}
            {comparisons.map((row, index) => (
              <div 
                key={row.feature}
                className={`grid grid-cols-3 ${index !== comparisons.length - 1 ? 'border-b' : ''}`}
              >
                <div className="p-4 text-sm sm:text-base">{row.feature}</div>
                <div className="p-4 text-center border-x text-muted-foreground">
                  {typeof row.manual === 'boolean' ? (
                    row.manual ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" aria-label="Yes" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" aria-label="No" />
                    )
                  ) : (
                    <span className="text-sm">{row.manual}</span>
                  )}
                </div>
                <div className="p-4 text-center bg-radar-50/50">
                  {typeof row.painpointradar === 'boolean' ? (
                    row.painpointradar ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" aria-label="Yes" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" aria-label="No" />
                    )
                  ) : (
                    <span className="text-sm font-medium text-radar-700">{row.painpointradar}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Competitive positioning note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>vs Keyword Alerts (F5Bot, Syften):</strong> We don&apos;t just notify you when keywords appear—we analyze thousands of existing posts, find patterns you didn&apos;t know to look for, and rank opportunities.
              <br />
              <strong>vs Audience Research Tools (Gummy Search):</strong> We go deeper with AI clustering, sentiment scoring, and opportunity ranking—not just keyword frequency.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
