import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock } from "lucide-react"

const roadmapItems = [
  {
    phase: "Now",
    status: "current",
    items: [
      "Reddit pain point discovery",
      "AI-powered clustering",
      "Opportunity scoring",
      "CSV export",
    ],
  },
  {
    phase: "Next",
    status: "upcoming",
    items: [
      "Multiple data sources (HN, Twitter)",
      "Saved searches & alerts",
      "Team collaboration",
      "API access",
    ],
  },
  {
    phase: "Later",
    status: "planned",
    items: [
      "Competitor analysis",
      "Market size estimation",
      "Landing page generator",
      "Idea validation surveys",
    ],
  },
]

export function RoadmapSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Product Roadmap
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;re building the ultimate tool for product discovery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roadmapItems.map((phase) => (
            <div 
              key={phase.phase} 
              className={`rounded-lg border-2 p-6 ${
                phase.status === 'current' 
                  ? 'border-radar-500 bg-radar-50/50' 
                  : 'border-muted'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={phase.status === 'current' ? 'default' : 'secondary'}>
                  {phase.phase}
                </Badge>
                {phase.status === 'current' && (
                  <span className="text-xs text-radar-600 font-medium">Building</span>
                )}
              </div>
              
              <ul className="space-y-3">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    {phase.status === 'current' ? (
                      <CheckCircle className="h-5 w-5 text-radar-600 mt-0.5 flex-shrink-0" />
                    ) : phase.status === 'upcoming' ? (
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <span className={phase.status === 'current' ? '' : 'text-muted-foreground'}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
