import { TrendingUp, MessageSquare, Target } from "lucide-react"

const reasons = [
  {
    icon: TrendingUp,
    title: "Reddit is the largest focus group",
    description: "Over 50M daily active users openly discuss their problems, frustrations, and wishes. It's unfiltered customer research at scale.",
  },
  {
    icon: MessageSquare,
    title: "Manual research doesn't scale",
    description: "Reading thousands of posts takes weeks. Our AI clusters and ranks pain points in minutes, so you can focus on building.",
  },
  {
    icon: Target,
    title: "Build with confidence",
    description: "Stop guessing what to build. See exactly what problems people have, how often they mention them, and how urgent they feel.",
  },
]

export function WhyNowSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Why Now?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The opportunity for data-driven product discovery has never been better
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex flex-col items-start">
              <div className="w-12 h-12 rounded-lg bg-radar-100 flex items-center justify-center mb-4">
                <reason.icon className="h-6 w-6 text-radar-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
