import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { WhoThisIsForSection } from "@/components/landing/who-this-is-for-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { SamplePreviewSection } from "@/components/landing/sample-preview-section"
import { ComparisonSection } from "@/components/landing/comparison-section"
import { WhyNowSection } from "@/components/landing/why-now-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { TrustSection } from "@/components/landing/trust-section"
import { FAQSection } from "@/components/landing/faq-section"
import { RoadmapSection } from "@/components/landing/roadmap-section"
import { LeadMagnetSection } from "@/components/landing/lead-magnet-section"
import { WaitlistSection } from "@/components/landing/waitlist-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustSection />
        <WhoThisIsForSection />
        <SamplePreviewSection />
        <HowItWorksSection />
        <ComparisonSection />
        <WhyNowSection />
        <PricingSection />
        <FAQSection />
        <RoadmapSection />
        <LeadMagnetSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  )
}
