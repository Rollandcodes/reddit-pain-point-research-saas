import { Search, Cpu, FileBarChart } from "lucide-react"

const steps = [
  {
    icon: Search,
    step: "1",
    title: "Enter Your Keywords",
    description: "Tell us what market or problem space you're exploring. Add optional subreddits to focus your search.",
  },
  {
    icon: Cpu,
    step: "2",
    title: "We Analyze Discussions",
    description: "Our engine scans thousands of Reddit posts and comments, clustering similar pain points together.",
  },
  {
    icon: FileBarChart,
    step: "3",
    title: "Get Actionable Insights",
    description: "Receive a ranked list of pain points with sentiment scores, opportunity ratings, and real quotes.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From keywords to validated pain points in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-radar-200 to-transparent" />
              )}
              
              <div className="text-center">
                <div className="relative inline-flex">
                  <div className="w-24 h-24 rounded-full bg-radar-50 flex items-center justify-center mb-6">
                    <step.icon className="h-10 w-10 text-radar-600" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-radar-600 text-white flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
