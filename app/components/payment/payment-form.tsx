"use client"

import { useState, useEffect } from "react"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
)

interface PaymentFormProps {
  amount: number
  onSuccess?: (paymentIntentId: string) => void
  onError?: (error: string) => void
  description?: string
}

function PaymentFormContent({
  amount,
  onSuccess,
  onError,
  description,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [clientSecret, setClientSecret] = useState<string>("")

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "payment_intent",
            amount,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to create payment intent")
        }

        setClientSecret(data.clientSecret)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to initialize payment"
        setErrorMessage(message)
        setPaymentStatus("error")
        onError?.(message)
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        })
      }
    }

    if (amount > 0) {
      createPaymentIntent()
    }
  }, [amount, onError, toast])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)
    setErrorMessage("")

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setErrorMessage("Card element not found")
      setIsProcessing(false)
      return
    }

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (error) {
        setErrorMessage(error.message || "Payment failed")
        setPaymentStatus("error")
        onError?.(error.message || "Payment failed")
        toast({
          title: "Payment Failed",
          description: error.message || "Your payment could not be processed",
          variant: "destructive",
        })
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setPaymentStatus("success")
        onSuccess?.(paymentIntent.id)
        toast({
          title: "Payment Successful!",
          description: "Your payment has been processed successfully",
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred"
      setErrorMessage(message)
      setPaymentStatus("error")
      onError?.(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  }

  if (paymentStatus === "success") {
    return (
      <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <AlertDescription className="text-green-700 dark:text-green-300">
          Payment successful! Your transaction has been completed.
        </AlertDescription>
      </Alert>
    )
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Initializing payment...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {description && (
        <div className="text-sm text-muted-foreground">{description}</div>
      )}

      <div className="space-y-2">
        <Label htmlFor="card-element">Card Details</Label>
        <div className="rounded-md border border-input bg-background p-4">
          <CardElement id="card-element" options={cardElementOptions} />
        </div>
      </div>

      {errorMessage && paymentStatus === "error" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total Amount</span>
        <span className="text-lg font-semibold">${amount.toFixed(2)}</span>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || isProcessing || !clientSecret}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>
    </form>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  const options: StripeElementsOptions = {
    appearance: {
      theme: "stripe",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>Enter your card details to complete the payment</CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={options}>
          <PaymentFormContent {...props} />
        </Elements>
      </CardContent>
    </Card>
  )
}

