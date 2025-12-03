"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export function PaymentStatus() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"success" | "canceled" | "loading" | null>(null)

  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")
    const sessionId = searchParams.get("session_id")

    if (success === "true" && sessionId) {
      setStatus("success")
      // Optionally verify the session with your backend
      verifySession(sessionId)
    } else if (canceled === "true") {
      setStatus("canceled")
    }
  }, [searchParams])

  const verifySession = async (sessionId: string) => {
    // Optional: Verify the checkout session with your backend
    // This adds an extra layer of security
    try {
      // You could create a /api/stripe/verify endpoint
      console.log("Session completed:", sessionId)
    } catch (error) {
      console.error("Session verification failed:", error)
    }
  }

  if (!status) return null

  return (
    <div className="mb-6">
      {status === "success" && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <AlertTitle className="text-green-700 dark:text-green-300">
            Payment Successful!
          </AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-400">
            Thank you for your subscription. Your account has been upgraded and you now have access to all premium features.
          </AlertDescription>
        </Alert>
      )}

      {status === "canceled" && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <XCircle className="h-5 w-5 text-yellow-500" />
          <AlertTitle className="text-yellow-700 dark:text-yellow-300">
            Payment Canceled
          </AlertTitle>
          <AlertDescription className="text-yellow-600 dark:text-yellow-400">
            Your payment was canceled. No charges have been made. Feel free to try again when you're ready.
          </AlertDescription>
        </Alert>
      )}

      {status === "loading" && (
        <Alert>
          <Loader2 className="h-5 w-5 animate-spin" />
          <AlertTitle>Processing...</AlertTitle>
          <AlertDescription>
            Please wait while we confirm your payment.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
