import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import Script from "next/script"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PainPointRadar - Discover Reddit Pain Points",
  description: "Turn thousands of Reddit posts into a launch-ready SaaS idea in minutes. Find validated problems before you write a single line of code.",
  keywords: ["saas", "reddit", "pain points", "product discovery", "startup ideas", "market research"],
  authors: [{ name: "PainPointRadar" }],
  openGraph: {
    title: "PainPointRadar - Discover Reddit Pain Points",
    description: "Turn thousands of Reddit posts into a launch-ready SaaS idea in minutes.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PainPointRadar - Discover Reddit Pain Points",
    description: "Turn thousands of Reddit posts into a launch-ready SaaS idea in minutes.",
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
        </head>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
