"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Radar, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 sm:px-6 flex h-14 sm:h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" aria-label="PainPointRadar Home">
          <Radar className="h-6 w-6 text-radar-600" aria-hidden="true" />
          <span className="text-xl font-bold">PainPointRadar</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link href="/sample-report" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sample Report
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 flex flex-col space-y-4" aria-label="Mobile navigation">
            <Link href="#how-it-works" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>How it works</Link>
            <Link href="#pricing" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="#faq" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link href="/sample-report" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Sample Report</Link>
            <Link href="/sign-in"><Button variant="ghost" className="w-full">Sign in</Button></Link>
            <Link href="/sign-up"><Button className="w-full">Get Started</Button></Link>
          </nav>
        </div>
      )}
    </header>
  )
}
