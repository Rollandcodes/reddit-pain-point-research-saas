"use client"

import { useState } from "react"
import { PaymentForm } from "@/components/payment/payment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

/**
 * Demo page showing how to use the PaymentForm component
 * This demonstrates the payment intent integration
 */
export default function PaymentDemoPage() {
  const [amount, setAmount] = useState<number>(50)
  const [customAmount, setCustomAmount] = useState<string>("50")
  const [paymentIntentId, setPaymentIntentId] = useState<string>("")

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setCustomAmount(value)
      setAmount(numValue)
    }
  }

  const handlePaymentSuccess = (id: string) => {
    setPaymentIntentId(id)
    console.log("Payment successful! Payment Intent ID:", id)
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates the Stripe payment intent integration. Enter an amount and complete
          a test payment.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Configuration</CardTitle>
            <CardDescription>Set the payment amount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                min="0.50"
                step="0.01"
                value={customAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="50.00"
              />
              <p className="text-xs text-muted-foreground">
                Minimum amount: $0.50
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAmountChange("10")}
              >
                $10
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAmountChange("25")}
              >
                $25
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAmountChange("50")}
              >
                $50
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAmountChange("100")}
              >
                $100
              </Button>
            </div>

            {paymentIntentId && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Last Payment Intent ID:
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-mono break-all">
                  {paymentIntentId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <PaymentForm
          amount={amount}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          description={`Complete your payment of $${amount.toFixed(2)}`}
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. Environment Variables</h3>
              <p className="text-muted-foreground mb-2">
                Make sure you have these set in your <code className="bg-muted px-1 rounded">.env.local</code>:
              </p>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
{`STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Using the PaymentForm Component</h3>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
{`import { PaymentForm } from "@/components/payment/payment-form"

<PaymentForm
  amount={50}
  onSuccess={(paymentIntentId) => {
    console.log("Payment successful:", paymentIntentId)
  }}
  onError={(error) => {
    console.error("Payment failed:", error)
  }}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. API Endpoint</h3>
              <p className="text-muted-foreground">
                The payment form automatically calls <code className="bg-muted px-1 rounded">POST /api/stripe</code> with
                action <code className="bg-muted px-1 rounded">payment_intent</code> to create a payment intent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

