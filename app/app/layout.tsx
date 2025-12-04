import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import Script from "next/script"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Find Validated SaaS Ideas from Reddit | AI Pain Point Discovery Tool - PainPointRadar",
  description: "Discover customer pain points from Reddit in minutes. AI-powered clustering analyzes 1000s of posts, ranks SaaS opportunities by demand. 3 free scans included.",
  keywords: ["saas ideas", "reddit research", "pain point analysis", "product discovery", "startup validation", "market research", "customer research", "reddit scraping", "ai clustering"],
  authors: [{ name: "PainPointRadar" }],
  openGraph: {
    title: "Find Validated SaaS Ideas from Reddit in 5 Minutes",
    description: "AI analyzes 1000+ Reddit posts → 10-20 ranked pain point clusters. Discover what customers actually need before building.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Validated SaaS Ideas from Reddit in 5 Minutes",
    description: "AI analyzes 1000+ Reddit posts → 10-20 ranked pain point clusters. 3 free scans included.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Plausible Analytics - privacy-friendly, GDPR compliant */}
          <Script
            defer
            data-domain="reddit-pain-point-research-saas.vercel.app"
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
          
          {/* Structured Data for SEO */}
          <Script
            id="structured-data-software"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "PainPointRadar",
                "applicationCategory": "BusinessApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "3 free scans included"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "5.0",
                  "ratingCount": "3"
                },
                "description": "AI-powered tool that analyzes Reddit discussions to discover customer pain points and validate SaaS ideas in minutes."
              })
            }}
          />
          
          <Script
            id="structured-data-faq"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What exactly is a scan?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "One scan = one keyword search across unlimited subreddits, analyzing up to 1,000 posts per keyword. You get AI-clustered pain points, sentiment analysis, opportunity scores, and CSV export for each scan."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How are Opportunity Scores calculated?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Opportunity Score (0-100) = (mention frequency × sentiment intensity × urgency keywords × recency). Higher scores = better SaaS opportunities."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How long does a scan take?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Most scans complete in 2-5 minutes. We analyze thousands of Reddit discussions in real-time, cluster similar pain points using AI, and generate your report."
                    }
                  }
                ]
              })
            }}
          />
        </head>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
