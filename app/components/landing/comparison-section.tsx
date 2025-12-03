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
    painpointradar: "5,000+ posts",
  },
  {
    feature: "Pattern recognition",
    manual: "Human bias",
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
    painpointradar: "Data-driven ranking",
  },
  {
    feature: "Reproducible",
    manual: false,
    painpointradar: true,
  },
  {
    feature: "Scalable",
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
        </div>
      </div>
    </section>
  )
}
