import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { DemoVideoSection } from "@/components/landing/demo-video-section"
import { TryItFreeWidget } from "@/components/landing/try-it-free-widget"
import { WhoThisIsForSection } from "@/components/landing/who-this-is-for-section"
import { SamplePreviewSection } from "@/components/landing/sample-preview-section"
import { ProductScreenshotsSection } from "@/components/landing/product-screenshots-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
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
        <TryItFreeWidget />
        <DemoVideoSection />
        <TrustSection />
        <WhoThisIsForSection />
        <SamplePreviewSection />
        <ProductScreenshotsSection />
        <TestimonialsSection />
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
