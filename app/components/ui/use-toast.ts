// Simplified toast hook for payment components
// For full implementation, consider using @radix-ui/react-toast or sonner

import { useState, useCallback } from "react"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

interface ToastOptions {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = "default" }: ToastOptions) => {
    const id = String(++toastCount)
    
    setToasts((prev) => [...prev, { id, title, description, variant }])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)

    // Also log to console for debugging
    if (variant === "destructive") {
      console.error(`Toast: ${title}`, description)
    } else {
      console.log(`Toast: ${title}`, description)
    }

    return { id }
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toast, toasts, dismiss }
}
