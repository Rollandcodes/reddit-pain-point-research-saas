import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Users, Building2 } from "lucide-react"

const personas = [
  {
    icon: Rocket,
    title: "Indie Founders",
    description: "Validate your next SaaS idea before you build. Find problems people are actively discussing and willing to pay to solve.",
  },
  {
    icon: Users,
    title: "Product Managers",
    description: "Understand what your users really want. Discover feature requests and pain points straight from community discussions.",
  },
  {
    icon: Building2,
    title: "Agencies & Consultants",
    description: "Research markets for your clients. Deliver data-driven insights about customer problems and opportunities.",
  },
]

export function WhoThisIsForSection() {
  return (
    <section id="who-its-for" className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            Who This Is For
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            PainPointRadar helps anyone who wants to build products people actually need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {personas.map((persona) => (
            <Card key={persona.title} className="border-2 hover:border-radar-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-radar-100 flex items-center justify-center mb-4">
                  <persona.icon className="h-6 w-6 text-radar-600" />
                </div>
                <CardTitle>{persona.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {persona.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
