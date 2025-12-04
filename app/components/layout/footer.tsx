import Link from "next/link"
import { Radar } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4" aria-label="PainPointRadar Home">
              <Radar className="h-6 w-6 text-radar-600" aria-hidden="true" />
              <span className="text-xl font-bold">PainPointRadar</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Discover validated pain points from Reddit discussions. 
              Turn real user problems into your next SaaS idea.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link></li>
              <li><Link href="/sample-report" className="hover:text-foreground transition-colors">Sample Report</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="#waitlist" className="hover:text-foreground transition-colors">Get Early Access</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PainPointRadar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
