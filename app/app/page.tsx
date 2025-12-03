import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { WhoThisIsForSection } from "@/components/landing/who-this-is-for-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { WhyNowSection } from "@/components/landing/why-now-section"
import { RoadmapSection } from "@/components/landing/roadmap-section"
import { WaitlistSection } from "@/components/landing/waitlist-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <WhoThisIsForSection />
        <HowItWorksSection />
        <WhyNowSection />
        <RoadmapSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  )
}
