"use client"

import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    feature: "Pain point scoring",
    painpointradar: { value: true, label: "0-100 scale" },
    gummysearch: { value: false, label: null },
    painonsocial: { value: true, label: null },
  },
  {
    feature: "Real quotes",
    painpointradar: { value: true, label: null },
    gummysearch: { value: "limited", label: "Limited" },
    painonsocial: { value: true, label: null },
  },
  {
    feature: "CSV export",
    painpointradar: { value: true, label: null },
    gummysearch: { value: true, label: null },
    painonsocial: { value: true, label: null },
  },
  {
    feature: "Solution ideas",
    painpointradar: { value: true, label: null },
    gummysearch: { value: false, label: null },
    painonsocial: { value: true, label: null },
  },
  {
    feature: "Price",
    painpointradar: { value: "$19/mo", label: null },
    gummysearch: { value: "$29/mo", label: null },
    painonsocial: { value: "$19/mo", label: null },
  },
  {
    feature: "Free trial",
    painpointradar: { value: true, label: "7 days" },
    gummysearch: { value: false, label: null },
    painonsocial: { value: true, label: "7 days" },
  },
]

export function ComparisonTable() {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            How We Compare
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            See how PainPointRadar stacks up against the competition
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="rounded-lg border-2 overflow-hidden bg-card shadow-lg">
            {/* Header */}
            <div className="grid grid-cols-4 bg-muted/50 border-b">
              <div className="p-4 font-semibold text-sm sm:text-base">Feature</div>
              <div className="p-4 font-semibold text-sm sm:text-base text-center border-x bg-radar-50/50">
                <span className="text-radar-700">PainPointRadar</span>
              </div>
              <div className="p-4 font-semibold text-sm sm:text-base text-center border-r text-muted-foreground">
                GummySearch
              </div>
              <div className="p-4 font-semibold text-sm sm:text-base text-center text-muted-foreground">
                PainOnSocial
              </div>
            </div>

            {/* Rows */}
            {features.map((row, index) => (
              <div 
                key={row.feature}
                className={`grid grid-cols-4 ${index !== features.length - 1 ? 'border-b' : ''} hover:bg-muted/20 transition-colors`}
              >
                {/* Feature name */}
                <div className="p-4 text-sm sm:text-base font-medium flex items-center">
                  {row.feature}
                </div>

                {/* PainPointRadar - Highlighted */}
                <div className="p-4 text-center border-x bg-radar-50/30">
                  {typeof row.painpointradar.value === 'boolean' ? (
                    <div className="flex flex-col items-center gap-1">
                      {row.painpointradar.value ? (
                        <Check className="h-5 w-5 text-green-600" aria-label="Yes" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" aria-label="No" />
                      )}
                      {row.painpointradar.label && (
                        <span className="text-xs text-muted-foreground">{row.painpointradar.label}</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-medium text-radar-700">{row.painpointradar.value}</span>
                      {row.painpointradar.label && (
                        <Badge variant="secondary" className="bg-radar-100 text-radar-700 text-xs">
                          {row.painpointradar.label}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* GummySearch */}
                <div className="p-4 text-center border-r">
                  {typeof row.gummysearch.value === 'boolean' ? (
                    <div className="flex flex-col items-center gap-1">
                      {row.gummysearch.value ? (
                        <Check className="h-5 w-5 text-green-600" aria-label="Yes" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" aria-label="No" />
                      )}
                      {row.gummysearch.label && (
                        <span className="text-xs text-muted-foreground">{row.gummysearch.label}</span>
                      )}
                    </div>
                  ) : row.gummysearch.value === 'limited' ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm text-muted-foreground italic">{row.gummysearch.label}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm text-muted-foreground">{row.gummysearch.value}</span>
                      {row.gummysearch.label && (
                        <span className="text-xs text-muted-foreground">{row.gummysearch.label}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* PainOnSocial */}
                <div className="p-4 text-center">
                  {typeof row.painonsocial.value === 'boolean' ? (
                    <div className="flex flex-col items-center gap-1">
                      {row.painonsocial.value ? (
                        <Check className="h-5 w-5 text-green-600" aria-label="Yes" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" aria-label="No" />
                      )}
                      {row.painonsocial.label && (
                        <span className="text-xs text-muted-foreground">{row.painonsocial.label}</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm text-muted-foreground">{row.painonsocial.value}</span>
                      {row.painonsocial.label && (
                        <Badge variant="secondary" className="text-xs">
                          {row.painonsocial.label}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">PainPointRadar</span> combines the best features at a competitive price
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

