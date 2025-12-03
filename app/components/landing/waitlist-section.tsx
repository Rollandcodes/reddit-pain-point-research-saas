import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WaitlistForm } from "./waitlist-form"

export function WaitlistSection() {
  return (
    <section id="waitlist" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-muted/50">
      <div className="container px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join the Waitlist</CardTitle>
              <CardDescription>
                Be first to access PainPointRadar when we launch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WaitlistForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
