import { Shield, Lock, Server, CheckCircle } from "lucide-react"

const trustItems = [
  {
    icon: Shield,
    title: "GDPR Compliant",
    description: "Full compliance with EU data protection regulations",
  },
  {
    icon: Lock,
    title: "Data Never Stored",
    description: "Your queries are processed and not permanently stored",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Enterprise-grade security with encrypted connections",
  },
  {
    icon: CheckCircle,
    title: "SOC 2 Compliant",
    description: "Following industry-standard security practices",
  },
]

export function TrustSection() {
  return (
    <section className="py-8 sm:py-12 border-y bg-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {trustItems.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <item.icon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
