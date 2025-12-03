import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WaitlistForm } from "./waitlist-form"
import { Badge } from "@/components/ui/badge"
import { Lock, Clock } from "lucide-react"

export function WaitlistSection() {
  return (
    <section id="waitlist" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-muted/50">
      <div className="container px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          {/* Featured on badges */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Featured on Indie Hackers • Product Hunt
            </p>
            
            {/* Urgency indicator */}
            <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
              <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
              Only 50 beta spots left this month
            </Badge>
          </div>

          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join the Waitlist</CardTitle>
              <CardDescription>
                Be first to access PainPointRadar when we launch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WaitlistForm />
              
              {/* Security badge */}
              <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" aria-hidden="true" />
                <span>Your data never shared</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
